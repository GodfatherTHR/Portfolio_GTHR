'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createServerClient as createServerClientSSR } from '@supabase/ssr'
import type { CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'
import { createClient as createAdminClient } from '@supabase/supabase-js'

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


const projectSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  button_link: z.string().url().optional().or(z.literal('')),
  button_text: z.string().optional(),
  icon: z.string().optional(),
  json_id: z.string().optional(),
})

export async function upsertProject(formData: FormData) {
  const supabase = createClient()
  const rawData = Object.fromEntries(formData)
  const parsed = projectSchema.safeParse(rawData)
  
  if (!parsed.success) {
    return { error: parsed.error.format() }
  }

  const { id, ...data } = parsed.data
  const { error } = await supabase.from('projects').upsert(id ? { id, ...data } : data)

  if (error) {
    return { error: { _server: [error.message] } }
  }

  revalidatePath('/admin')
  revalidatePath('/#projects')
  return { data: 'Project saved successfully.' }
}

export async function deleteProject(id: number) {
    const supabase = createClient();
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
  title: z.string().min(1),
  venue: z.string().min(1),
  year: z.coerce.number().min(1900).max(2100),
  link: z.string().url().optional().or(z.literal('')),
  link_text: z.string().optional(),
  type: z.string().optional(),
  citation_count: z.coerce.number().optional(),
});

export async function upsertPublication(formData: FormData) {
  const supabase = createClient();
  const rawData = Object.fromEntries(formData);
  const parsed = publicationSchema.safeParse(rawData);

  if (!parsed.success) {
    return { error: parsed.error.format() };
  }
  
  const { id, ...data } = parsed.data;
  const { error } = await supabase.from('publications').upsert(id ? { id, ...data } : data);

  if (error) {
    return { error: { _server: [error.message] } };
  }

  revalidatePath('/admin');
  revalidatePath('/#research');
  return { data: 'Publication saved successfully.' };
}

export async function deletePublication(id: number) {
  const supabase = createClient();
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
  skill_name: z.string().min(1),
  skill_type: z.string().min(1),
  resume_id: z.coerce.number().optional().default(1),
});

export async function upsertSkill(formData: FormData) {
    const supabase = createClient();
    const rawData = Object.fromEntries(formData);
    const parsed = skillSchema.safeParse(rawData);
    
    if (!parsed.success) {
        return { error: parsed.error.format() };
    }

    const { id, ...data } = parsed.data;
    const { error } = await supabase.from('skills').upsert(id ? { id, ...data } : data);

    if (error) {
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
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Your project's URL and Key are required to create a Supabase client! Check your Supabase project's API settings to find these values");
  }

  const supabase = createAdminClient(supabaseUrl, supabaseServiceKey);

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
