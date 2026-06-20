import React from 'react';

const Card = ({ children, className = '', id }) => (
  <div
    id={id}
    className={`bg-white border border-[#EAECF0] rounded-[10px] overflow-hidden text-[#111111] ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className = '', action }) => (
  <div
    className={`
      flex items-start justify-between gap-4
      px-4 py-3.5 border-b border-[#EAECF0] bg-white
      ${className}
    `}
  >
    <div className="flex-1 min-w-0">{children}</div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-[13px] font-medium text-[#111111] ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = '' }) => (
  <p className={`text-[12px] text-[#9BA3AE] mt-0.5 ${className}`}>
    {children}
  </p>
);

const CardBody = ({ children, className = '' }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

const CardFooter = ({ children, className = '' }) => (
  <div
    className={`
      px-4 py-3 border-t border-[#EAECF0]
      bg-[#F7F8FA]
      ${className}
    `}
  >
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
