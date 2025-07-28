

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { randomUUID } from 'crypto'

const ownerSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  linkedin_url: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  github_url: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
})

export async function updateOwner(formData: FormData) {
  const supabase = createClient()
  const rawData = Object.fromEntries(formData)
  
  const parsed = ownerSchema.safeParse({
      ...rawData,
      id: parseInt(rawData.id as string)
  })

  if (!parsed.success) {
    return { error: parsed.error.format() }
  }
  
  const { error } = await supabase
    .from('portfolioowner')
    .update(parsed.data)
    .eq('id', parsed.data.id)

  if (error) {
    return { error: { _server: [error.message] } }
  }

  revalidatePath('/admin')
  revalidatePath('/')
  revalidatePath('/#research')
  return { data: 'Portfolio owner updated successfully.' }
}


const aboutContentSchema = z.object({
  id: z.coerce.number(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image_src: z.string().url('Must be a valid URL').or(z.literal('')),
  image_alt: z.string().optional(),
  expertise_title: z.string().min(1, 'Expertise title is required'),
  cta_text: z.string().optional(),
  cta_link: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  cta_icon: z.string().optional(),
});

const expertiseItemSchema = z.object({
  id: z.coerce.number().optional(),
  expertise_item: z.string().min(1, 'Expertise item cannot be empty'),
  about_id: z.coerce.number(),
});

export async function updateAboutContent(formData: FormData) {
  const supabase = createClient();

  const data = Object.fromEntries(formData);

  const aboutContentParsed = aboutContentSchema.safeParse({
    id: data.id,
    title: data.title,
    description: data.description,
    image_src: data.image_src,
    image_alt: data.image_alt,
    expertise_title: data.expertise_title,
    cta_text: data.cta_text,
    cta_link: data.cta_link,
    cta_icon: data.cta_icon,
  });

  if (!aboutContentParsed.success) {
    console.error("About content validation failed:", aboutContentParsed.error.format());
    return { error: aboutContentParsed.error.format() };
  }

  const { error: aboutError } = await supabase
    .from('aboutcontent')
    .update(aboutContentParsed.data)
    .eq('id', aboutContentParsed.data.id);

  if (aboutError) {
    return { error: { _server: ['Failed to update about content.'] } };
  }

  // Handle expertise items
  const expertiseItems = Object.keys(data)
    .filter(key => key.startsWith('expertise_item_'))
    .map(key => {
      const index = key.replace('expertise_item_', '');
      const idValue = data[`expertise_id_${index}`];
      return {
        id: idValue && idValue !== 'null' ? Number(idValue) : undefined,
        expertise_item: data[key],
        about_id: aboutContentParsed.data.id,
      };
    });

  const itemsToDelete = (data.deleted_expertise_ids as string || '')
    .split(',')
    .filter(Boolean)
    .map(Number);
    
  if (itemsToDelete.length > 0) {
      const { error: deleteError } = await supabase
          .from('aboutexpertise')
          .delete()
          .in('id', itemsToDelete);
      if (deleteError) {
          return { error: { _server: ['Failed to delete expertise items.'] } };
      }
  }

  if (expertiseItems.length > 0) {
    const parsedExpertiseItems = z.array(expertiseItemSchema).safeParse(expertiseItems);
    if (!parsedExpertiseItems.success) {
      return { error: { _server: ['Invalid expertise item format.'] } };
    }

    const { data: upsertedData, error: expertiseError } = await supabase
      .from('aboutexpertise')
      .upsert(parsedExpertiseItems.data)
      .select();

    if (expertiseError) {
      return { error: { _server: [expertiseError.message] } };
    }
  }


  revalidatePath('/admin');
  revalidatePath('/#about');

  return { data: 'About section updated successfully.' };
}

const projectSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  button_link: z.string().url().optional().or(z.literal('')),
  button_text: z.string().optional(),
  icon: z.string().optional(),
  json_id: z.string().optional(),
  image_src: z.string().url().optional().or(z.literal('')),
  alt_text: z.string().optional(),
});

export async function upsertProject(formData: FormData) {
  const supabase = createClient();
  const rawData = Object.fromEntries(formData);
  const selectedTagIds = formData.getAll('tags').map(String);

  const parsed = projectSchema.safeParse(rawData);

  if (!parsed.success) {
    return { error: parsed.error.format() };
  }

  // 1. Upsert project and get its ID
  const { id, ...data } = parsed.data;
  const { data: upsertedProject, error } = await supabase
    .from('projects')
    .upsert(id ? { id, ...data } : data)
    .select('id')
    .single();

  if (error || !upsertedProject) {
    return { error: { _server: [error?.message || 'Failed to save project.'] } };
  }

  const projectId = upsertedProject.id;

  // 2. Remove existing tag relations for this project
  const { error: deleteError } = await supabase
    .from('projecttags')
    .delete()
    .eq('project_id', projectId);

  if (deleteError) {
    return { error: { _server: ['Failed to update project tags (delete step).'] } };
  }

  // 3. Insert new tag relations if any tags were selected
  if (selectedTagIds.length > 0) {
    const newRelations = selectedTagIds.map(tagId => ({
      project_id: projectId,
      tag_id: parseInt(tagId, 10),
    }));

    const { error: insertError } = await supabase
      .from('projecttags')
      .insert(newRelations);

    if (insertError) {
      return { error: { _server: ['Failed to update project tags (insert step).'] } };
    }
  }

  revalidatePath('/admin');
  revalidatePath('/#projects');
  return { data: 'Project saved successfully.' };
}

export async function deleteProject(id: number) {
    const supabase = createClient();

    // Need to delete from the join table first due to foreign key constraints
    await supabase.from('projecttags').delete().eq('project_id', id);

    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) {
        return { error: { _server: [error.message] } };
    }
    revalidatePath('/admin');
    revalidatePath('/#projects');
    return { data: 'Project deleted successfully.' };
}


const publicationSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, 'Title is required'),
  venue: z.string().min(1, 'Venue is required'),
  year: z.coerce.number().min(1900, 'Invalid year').max(2100, 'Invalid year'),
  link: z.string().url('Invalid URL').optional().or(z.literal('')),
  link_text: z.string().optional(),
  type: z.string().optional(),
  citation_count: z.coerce.number().optional().default(0),
  description: z.string().optional(),
  json_id: z.string().optional(),
});

export async function upsertPublication(formData: FormData) {
  const supabase = createClient();
  const rawData = Object.fromEntries(formData);
  const selectedTagIds = formData.getAll('tags').map(String);

  const parsed = publicationSchema.safeParse(rawData);

  if (!parsed.success) {
    return { error: parsed.error.format() };
  }

  // 1. Upsert publication and get its ID
  const { id, ...data } = parsed.data;
  const { data: upsertedPublication, error } = await supabase
    .from('publications')
    .upsert(id ? { id, ...data } : data)
    .select('id')
    .single();

  if (error || !upsertedPublication) {
    return { error: { _server: [error?.message || 'Failed to save publication.'] } };
  }

  const publicationId = upsertedPublication.id;

  // 2. Remove existing tag relations for this publication
  const { error: deleteError } = await supabase
    .from('publicationtags')
    .delete()
    .eq('publication_id', publicationId);

  if (deleteError) {
    return { error: { _server: ['Failed to update publication tags (delete step).'] } };
  }

  // 3. Insert new tag relations if any tags were selected
  if (selectedTagIds.length > 0) {
    const newRelations = selectedTagIds.map(tagId => ({
      publication_id: publicationId,
      tag_id: parseInt(tagId, 10),
    }));

    const { error: insertError } = await supabase
      .from('publicationtags')
      .insert(newRelations);

    if (insertError) {
      return { error: { _server: ['Failed to update publication tags (insert step).'] } };
    }
  }

  revalidatePath('/admin');
  revalidatePath('/#research');
  return { data: 'Publication saved successfully.' };
}


export async function deletePublication(id: number) {
  const supabase = createClient();
  
  // Need to delete from the join table first due to foreign key constraints
  await supabase.from('publicationtags').delete().eq('publication_id', id);
  
  const { error } = await supabase.from('publications').delete().eq('id', id);

  if (error) {
    return { error: { _server: [error.message] } };
  }
  revalidatePath('/admin');
  revalidatePath('/#research');
  return { data: 'Publication deleted successfully.' };
}


const experienceSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1),
  company: z.string().min(1),
  dates: z.string().min(1),
  description: z.string().optional(),
});

export async function upsertExperience(formData: FormData) {
  const supabase = createClient();
  const rawData = Object.fromEntries(formData);
  const parsed = experienceSchema.safeParse(rawData);

  if (!parsed.success) {
    return { error: parsed.error.format() };
  }
  
  const { id, ...data } = parsed.data;
  const dataToUpsert = { ...data, resume_id: 1 };
  
  const { error } = await supabase.from('professionalexperience').upsert(id ? { id, ...dataToUpsert } : dataToUpsert);

  if (error) {
    return { error: { _server: [error.message] } };
  }

  revalidatePath('/admin');
  revalidatePath('/#resume');
  return { data: 'Experience saved successfully.' };
}

export async function deleteExperience(id: number) {
  const supabase = createClient();
  const { error } = await supabase.from('professionalexperience').delete().eq('id', id);

  if (error) {
    return { error: { _server: [error.message] } };
  }
  revalidatePath('/admin');
  revalidatePath('/#resume');
  return { data: 'Experience deleted successfully.' };
}

const awardSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1),
  organization: z.string().min(1),
  year: z.coerce.number().min(1900).max(2100),
  description: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal('')),
  url: z.string().url().optional().or(z.literal('')),
});

export async function upsertAward(formData: FormData) {
    const supabase = createClient();
    const rawData = Object.fromEntries(formData);
    const parsed = awardSchema.safeParse(rawData);

    if (!parsed.success) {
        return { error: parsed.error.format() };
    }

    const { id, ...data } = parsed.data;
    const { error } = await supabase.from('awards').upsert(id ? { id, ...data } : data);

    if (error) {
        return { error: { _server: [error.message] } };
    }

    revalidatePath('/admin');
    revalidatePath('/#awards');
    return { data: 'Award saved successfully.' };
}

export async function deleteAward(id: number) {
    const supabase = createClient();
    const { error } = await supabase.from('awards').delete().eq('id', id);

    if (error) {
        return { error: { _server: [error.message] } };
    }
    revalidatePath('/admin');
    revalidatePath('/#awards');
    return { data: 'Award deleted successfully.' };
}


const skillSchema = z.object({
  id: z.coerce.number().optional(),
  skill_name: z.string().min(1, 'Skill name is required'),
  skill_type: z.string().min(1, 'Skill type is required'),
});

export async function upsertSkill(formData: FormData) {
  const supabase = createClient();
  const rawData = Object.fromEntries(formData);

  const parsed = skillSchema.safeParse(rawData);

  if (!parsed.success) {
    console.error("Skill validation failed:", parsed.error.format());
    return { error: parsed.error.format() };
  }

  const { id, ...data } = parsed.data;
  const dataToUpsert = {
    ...data,
    resume_id: 1, // Always associate with the main resume
  };

  const { error } = await supabase
    .from('skills')
    .upsert(id ? { id, ...dataToUpsert } : dataToUpsert);

  if (error) {
    console.error("Supabase skill upsert error:", error);
    return { error: { _server: [error.message] } };
  }

  revalidatePath('/admin');
  revalidatePath('/#resume');
  return { data: 'Skill saved successfully.' };
}

export async function deleteSkill(id: number) {
    const supabase = createClient();
    const { error } = await supabase.from('skills').delete().eq('id', id);

    if (error) {
        return { error: { _server: [error.message] } };
    }
    revalidatePath('/admin');
    revalidatePath('/#resume');
    return { data: 'Skill deleted successfully.' };
}

const contactInfoSchema = z.object({
  id: z.coerce.number(),
  title: z.string().min(1),
  description: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
})

export async function updateContactInfo(formData: FormData) {
  const supabase = createClient()
  const rawData = Object.fromEntries(formData)
  
  const parsed = contactInfoSchema.safeParse(rawData)

  if (!parsed.success) {
    return { error: parsed.error.format() }
  }
  
  const { error } = await supabase
    .from('contactinfo')
    .update(parsed.data)
    .eq('id', parsed.data.id)

  if (error) {
    return { error: { _server: [error.message] } }
  }

  revalidatePath('/admin')
  revalidatePath('/#contact')
  return { data: 'Contact info updated successfully.' }
}

const researchProfileSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, "Name is required"),
  link: z.string().url("Must be a valid URL"),
  icon: z.string().optional(),
});

export async function upsertResearchProfile(formData: FormData) {
  const supabase = createClient();
  const rawData = Object.fromEntries(formData);
  const parsed = researchProfileSchema.safeParse(rawData);

  if (!parsed.success) {
    return { error: parsed.error.format() };
  }

  const { id, ...data } = parsed.data;
  const { error } = await supabase.from('researchprofiles').upsert(id ? { id, ...data } : data);

  if (error) {
    return { error: { _server: [error.message] } };
  }

  revalidatePath('/admin');
  revalidatePath('/#research-profiles');
  revalidatePath('/#research');
  revalidatePath('/');
  return { data: 'Research profile saved successfully.' };
}

export async function deleteResearchProfile(id: number) {
  const supabase = createClient();
  const { error } = await supabase.from('researchprofiles').delete().eq('id', id);

  if (error) {
    return { error: { _server: [error.message] } };
  }
  revalidatePath('/admin');
  revalidatePath('/#research-profiles');
  revalidatePath('/#research');
  revalidatePath('/');
  return { data: 'Research profile deleted successfully.' };
}

const educationSchema = z.object({
  id: z.coerce.number().optional(),
  degree: z.string().min(1, 'Degree is required'),
  institution: z.string().min(1, 'Institution is required'),
  dates: z.string().min(1, 'Dates are required'),
  notes: z.string().optional(),
});

export async function upsertEducation(formData: FormData) {
  const supabase = createClient();
  const rawData = Object.fromEntries(formData);
  const parsed = educationSchema.safeParse(rawData);

  if (!parsed.success) {
    return { error: parsed.error.format() };
  }
  
  const { id, ...data } = parsed.data;
  const dataToUpsert = { ...data, resume_id: 1 };
  
  const { error } = await supabase.from('education').upsert(id ? { id, ...dataToUpsert } : dataToUpsert);

  if (error) {
    return { error: { _server: [error.message] } };
  }

  revalidatePath('/admin');
  revalidatePath('/#resume');
  return { data: 'Education saved successfully.' };
}

export async function deleteEducation(id: number) {
  const supabase = createClient();
  const { error } = await supabase.from('education').delete().eq('id', id);

  if (error) {
    return { error: { _server: [error.message] } };
  }
  revalidatePath('/admin');
  revalidatePath('/#resume');
  return { data: 'Education deleted successfully.' };
}

const blogPostSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  author: z.string().min(1, 'Author is required'),
  status: z.enum(['draft', 'published']),
  image_url: z.string().url().optional().or(z.literal('')),
});

export async function upsertBlogPost(formData: FormData) {
  const supabase = createClient();
  const rawData = Object.fromEntries(formData);

  const parsed = blogPostSchema.safeParse(rawData);

  if (!parsed.success) {
    return { error: parsed.error.format() };
  }

  const { id, ...data } = parsed.data;

  const dataToUpsert: any = { ...data };
  if (data.status === 'published' && !id) {
    dataToUpsert.published_at = new Date().toISOString();
  } else if (data.status === 'published' && id) {
    const { data: existingPost } = await supabase.from('blog_posts').select('published_at').eq('id', id).single();
    if (!existingPost?.published_at) {
      dataToUpsert.published_at = new Date().toISOString();
    }
  }

  const { error } = await supabase.from('blog_posts').upsert(id ? { id, ...dataToUpsert } : { ...dataToUpsert, id: randomUUID() });

  if (error) {
    console.error('Supabase error:', error);
    return { error: { _server: [error.message] } };
  }

  revalidatePath('/admin');
  revalidatePath('/blog');
  revalidatePath(`/blog/${data.slug}`);
  return { data: 'Blog post saved successfully.' };
}


export async function deleteBlogPost(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);

    if (error) {
        return { error: { _server: [error.message] } };
    }
    revalidatePath('/admin');
    revalidatePath('/blog');
    return { data: 'Blog post deleted successfully.' };
}

const messageSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  message: z.string().min(1, 'Message is required'),
})

export async function saveMessage(formData: FormData) {
  const supabase = createClient();
  const rawData = Object.fromEntries(formData)
  const parsed = messageSchema.safeParse(rawData)

  if (!parsed.success) {
    return { error: parsed.error.format() }
  }
  
  const dataToInsert = {
    ...parsed.data,
  };

  const { error } = await supabase.from('messages').insert(dataToInsert);

  if (error) {
    return { error: { _server: [error.message] } }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/messages')
  return { data: 'Message sent successfully!' }
}

export async function markMessageAsRead(id: number) {
  const supabase = createClient()
  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('id', id)

  if (error) {
    return { error: { _server: [error.message] } }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/messages')
  return { data: 'Message marked as read.' }
}
