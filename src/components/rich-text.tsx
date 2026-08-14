import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type RichTextProps = {
  content: string;
  className?: string;
};

/**
 * Render markdown content but demote h1/h2 to h3 so embedded content
 * never collides with a page's real heading hierarchy.
 */
export default function RichText({ content, className }: RichTextProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className={className}
      components={{
        h1: ({ children }) => <h3 className="text-xl font-bold mb-2">{children}</h3>,
        h2: ({ children }) => <h3 className="text-lg font-bold mb-2">{children}</h3>,
        h3: ({ children }) => <h4 className="text-base font-bold mb-2">{children}</h4>,
        h4: ({ children }) => <h5 className="text-sm font-bold mb-2">{children}</h5>,
        h5: ({ children }) => <h6 className="text-sm font-semibold mb-2">{children}</h6>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
