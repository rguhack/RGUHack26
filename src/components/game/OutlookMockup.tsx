import React, { useMemo } from "react";

const UNREAD_EMAILS = [
  {
    from: "Michael (VP)",
    subject: "RE: RE: RE: Q3 Sprint Planning - URGENT",
  },
  {
    from: "Sandra (HR)",
    subject: "Mandatory Fun: Team Building Next Friday",
  },
  {
    from: "Dave (ED)",
    subject: "Quick sync? (will take 2 hrs)",
  },
  {
    from: "Karen (SE)",
    subject: "Budget cuts - please review ASAP",
  },
  {
    from: "Brian (VP)",
    subject: "Why is prod down again???",
  },
  { from: "Tom (MD)", subject: "Can you stay late tonight?" },
  {
    from: "Jenny (ED)",
    subject: "Git blame says this is your fault",
  },
];

const READ_EMAILS = [
  {
    from: "IT Support",
    subject: "Your password expires in 1 day",
    time: "Yesterday",
  },
  {
    from: "Noreply (HR)",
    subject: "Updated: Holiday policy 2026 (please read)",
    time: "Yesterday",
  },
  {
    from: "Michael (VP)",
    subject: "RE: Team offsite — venue confirmed",
    time: "Mon",
  },
  {
    from: "All Staff",
    subject: "Reminder: submit timesheets by Friday",
    time: "Mon",
  },
  {
    from: "Facilities",
    subject: "AC on floor 2 is fixed (finally)",
    time: "Sun",
  },
];

interface OutlookMockupProps {
  onPlayAgain: () => void;
}

export const OutlookMockup: React.FC<OutlookMockupProps> = ({
  onPlayAgain,
}) => {
  const unreadEmails = useMemo(() => {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const minOffsetMs = 60 * 1000;

    const withDates = UNREAD_EMAILS.map((email) => {
      const randomOffset =
        minOffsetMs + Math.floor(Math.random() * (oneDayMs - minOffsetMs + 1));
      const timestamp = new Date(now - randomOffset);
      return { ...email, timestamp };
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const formatter = new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });

    return withDates.map((email) => ({
      ...email,
      time: formatter.format(email.timestamp),
    }));
  }, []);

  return (
    <div className="flex flex-col" style={{ width: 710 }}>
      {/* Outlook toolbar */}
      <div
        className="flex items-center gap-2 px-2 py-1"
        style={{
          background:
            "linear-gradient(180deg, hsl(213,60%,88%), hsl(213,40%,80%))",
          borderBottom: "1px solid hsl(220,10%,70%)",
          fontFamily: "var(--font-body)",
          fontSize: 14,
        }}
      >
        <span style={{ fontWeight: 700 }}>📥 Inbox</span>
        <span style={{ color: "#666" }}>|</span>
        <span>New</span>
        <span>Reply</span>
        <span>Forward</span>
        <span>Delete</span>
        <span
          style={{
            marginLeft: "auto",
            color: "#c00",
            fontFamily: "var(--font-display)",
            fontSize: 13,
          }}
        >
          7 Unread
        </span>
      </div>

      {/* Column headers */}
      <div
        className="grid px-2 py-1"
        style={{
          gridTemplateColumns: "20px 140px 1fr 60px",
          background: "hsl(210,14%,93%)",
          borderBottom: "1px solid hsl(220,10%,78%)",
          fontFamily: "var(--font-body)",
          fontSize: 13,
          color: "#555",
          fontWeight: 700,
        }}
      >
        <span>!</span>
        <span>From</span>
        <span>Subject</span>
        <span>Time</span>
      </div>

      {/* Email rows */}
      <div style={{ background: "#fff", height: 350, overflowY: "auto" }}>
        {/* Unread emails */}
        {unreadEmails.map((email, i) => (
          <div
            key={`unread-${i}`}
            className="grid px-2 py-1"
            style={{
              gridTemplateColumns: "20px 140px 1fr 60px",
              borderBottom: "1px solid #e8e8e8",
              fontFamily: "var(--font-body)",
              fontSize: 14,
              fontWeight: 700,
              color: "#111",
              cursor: "pointer",
              background: i % 2 === 0 ? "#fff" : "#eef3fb",
            }}
          >
            <span style={{ color: "#1a5cb5" }}>✉</span>
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {email.from}
            </span>
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {email.subject}
            </span>
            <span style={{ color: "#1a5cb5", fontWeight: 700, fontSize: 12 }}>
              {email.time}
            </span>
          </div>
        ))}

        {/* Divider */}
        <div
          style={{
            background: "hsl(210,14%,93%)",
            borderTop: "1px solid hsl(220,10%,78%)",
            borderBottom: "1px solid hsl(220,10%,78%)",
            padding: "2px 8px",
            fontSize: 11,
            color: "#888",
            fontFamily: "var(--font-body)",
          }}
        >
          Older — Read
        </div>

        {/* Read emails */}
        {READ_EMAILS.map((email, i) => (
          <div
            key={`read-${i}`}
            className="grid px-2 py-1"
            style={{
              gridTemplateColumns: "20px 140px 1fr 60px",
              borderBottom: "1px solid #e8e8e8",
              fontFamily: "var(--font-body)",
              fontSize: 14,
              fontWeight: 400,
              color: "#555",
              cursor: "pointer",
              background: i % 2 === 0 ? "#f9f9f9" : "#f2f2f2",
            }}
          >
            <span style={{ color: "#aaa" }}>✉</span>
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {email.from}
            </span>
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {email.subject}
            </span>
            <span style={{ color: "#aaa", fontSize: 12 }}>{email.time}</span>
          </div>
        ))}
      </div>

      {/* Status bar */}
      <div
        className="flex items-center justify-between px-2 py-1"
        style={{
          background: "hsl(210,14%,93%)",
          borderTop: "1px solid hsl(220,10%,78%)",
          fontFamily: "var(--font-body)",
          fontSize: 12,
          color: "#666",
        }}
      >
        <span>12 Items, 7 Unread</span>
        <button onClick={onPlayAgain} className="xp-button text-xs px-3 py-0.5">
          Close Inbox
        </button>
        <span>Connected to Exchange Server</span>
      </div>
    </div>
  );
};
