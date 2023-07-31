import React from "react";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import oneDark from "react-syntax-highlighter/dist/cjs/styles/prism/one-dark";
import "github-markdown-css/github-markdown.css";
import ReactMarkdown from "react-markdown";

interface Props {
  doc: string;
}

const Preview: React.FC<Props> = ({ doc }: { doc: string }) => {
  return (
    <div className="preview markdown-body p-2 pb-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className ?? "");
            return !inline && match ? (
              <SyntaxHighlighter
                {...props}
                style={oneDark}
                language={match[1]}
                PreTag="div"
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code {...props} className={className}>
                {children}
              </code>
            );
          },
        }}
      >
        {doc}
      </ReactMarkdown>
    </div>
  );
};

export default Preview;
