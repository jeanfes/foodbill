import React from "react";

const NotFoundIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    return (
        <svg
            width={160}
            height={160}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <rect x="2" y="2" width="20" height="20" rx="6" fill="currentColor" opacity="0.06" />
            <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2" opacity="0.12" />
        </svg>
    );
};

export default NotFoundIcon;
