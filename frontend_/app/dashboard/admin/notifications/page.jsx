

// "use client";

// import { useEffect, useState, useRef } from "react";
// import {
//   Send, Search, Clock, CheckCircle,
//   MessageSquare, X, ChevronDown, ChevronUp
// } from "lucide-react";
// import styles from "./notifications.module.css";

// function InboxItem({ msg, token, onReplySent }) {
//   const [showReply, setShowReply] = useState(false);
//   const [reply, setReply] = useState("");
//   const [sending, setSending] = useState(false);
//   const [sent, setSent] = useState(false);

//   const handleReply = async () => {
//     if (!reply.trim()) return;
//     setSending(true);
//     try {
//       const res = await fetch("http://localhost:5000/api/notifications/send", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           volunteer_id: msg.volunteer_id,
//           message: reply.trim(),
//         }),
//       });
//       if (res.ok) {
//         setSent(true);
//         setReply("");
//         setShowReply(false);
//         if (onReplySent) onReplySent();
//       }
//     } catch {}
//     setSending(false);
//   };

//   return (
//     <div className={`${styles.inboxItem} ${!msg.is_read ? styles.inboxUnread : ""}`}>
//       <div className={styles.inboxAvatar}>
//         {msg.volunteer_name?.charAt(0).toUpperCase()}
//       </div>
//       <div className={styles.inboxContent}>
//         <div className={styles.inboxTop}>
//           <span className={styles.inboxName}>{msg.volunteer_name}</span>
//           <span className={styles.inboxEmail}>{msg.volunteer_email}</span>
//           <span className={styles.inboxTime}>
//             <Clock size={11} />
//             {msg.sent_at
//               ? new Date(msg.sent_at).toLocaleDateString("en-US", {
//                   month: "short", day: "numeric",
//                   hour: "2-digit", minute: "2-digit"
//                 })
//               : "Recently"}
//           </span>
//         </div>
//         <p className={styles.inboxMsg}>{msg.message}</p>

//         <div className={styles.inboxActions}>
//           {!msg.is_read && <span className={styles.unreadBadge}>New</span>}

//           {sent ? (
//             <p className={styles.replySentMsg}>
//               <CheckCircle size={13} /> Reply sent!
//             </p>
//           ) : (
//             <button
//               className={styles.replyToggle}
//               onClick={() => setShowReply(!showReply)}
//             >
//               {showReply ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
//               {showReply ? "Cancel" : "Reply"}
//             </button>
//           )}
//         </div>

//         {showReply && !sent && (
//           <div className={styles.replyBox}>
//             <textarea
//               className={styles.replyTextarea}
//               placeholder={`Reply to ${msg.volunteer_name}...`}
//               value={reply}
//               onChange={(e) => setReply(e.target.value)}
//               rows={3}
//             />
//             <button
//               className={styles.replyBtn}
//               onClick={handleReply}
//               disabled={!reply.trim() || sending}
//             >
//               <Send size={13} />
//               {sending ? "Sending..." : "Send Reply"}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function AdminNotificationsPage() {
//   const [searchQuery, setSearchQuery]             = useState("");
//   const [volunteers, setVolunteers]               = useState([]);
//   const [showDropdown, setShowDropdown]           = useState(false);
//   const [selectedVolunteer, setSelectedVolunteer] = useState(null);
//   const [message, setMessage]                     = useState("");
//   const [inbox, setInbox]                         = useState([]);
//   const [sending, setSending]                     = useState(false);
//   const [successMsg, setSuccessMsg]               = useState("");
//   const [activeTab, setActiveTab]                 = useState("send");
//   const [searchLoading, setSearchLoading]         = useState(false);
//   const searchRef                                 = useRef(null);

//   const token = typeof window !== "undefined"
//     ? localStorage.getItem("access_token")
//     : null;

//   useEffect(() => {
//     function handleClickOutside(e) {
//       if (searchRef.current && !searchRef.current.contains(e.target)) {
//         setShowDropdown(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     const fetchVolunteers = async () => {
//       setSearchLoading(true);
//       try {
//         const res = await fetch(
//           `http://localhost:5000/api/notifications/search-volunteers?q=${searchQuery}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         if (res.ok) {
//           const data = await res.json();
//           setVolunteers(data);
//           setShowDropdown(true);
//         }
//       } catch {}
//       setSearchLoading(false);
//     };
//     const timer = setTimeout(() => { fetchVolunteers(); }, 300);
//     return () => clearTimeout(timer);
//   }, [searchQuery]);

//   const fetchInbox = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/notifications/admin/inbox", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.ok) {
//         const data = await res.json();
//         setInbox(data);
//       }
//     } catch {}
//   };

//   useEffect(() => {
//     if (activeTab === "inbox") fetchInbox();
//   }, [activeTab]);

//   const handleSelectVolunteer = (v) => {
//     setSelectedVolunteer(v);
//     setSearchQuery(v.name);
//     setShowDropdown(false);
//   };

//   const handleClear = () => {
//     setSelectedVolunteer(null);
//     setSearchQuery("");
//     setVolunteers([]);
//     setShowDropdown(false);
//   };

//   const handleSend = async () => {
//     if (!selectedVolunteer || !message.trim()) return;
//     setSending(true);
//     try {
//       const res = await fetch("http://localhost:5000/api/notifications/send", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           volunteer_id: selectedVolunteer.volunteer_id,
//           message: message.trim(),
//         }),
//       });
//       if (res.ok) {
//         setSuccessMsg(`Message sent to ${selectedVolunteer.name}!`);
//         setMessage("");
//         handleClear();
//         setTimeout(() => setSuccessMsg(""), 3000);
//       }
//     } catch {}
//     setSending(false);
//   };

//   const unreadCount = inbox.filter((m) => !m.is_read).length;

//   return (
//     <div className={styles.page}>
//       <div className={styles.header}>
//         <h1 className={styles.title}>Notifications</h1>
//         <p className={styles.subtitle}>Send messages to volunteers and view their replies</p>
//       </div>

//       {/* TABS */}
//       <div className={styles.tabsRow}>
//         <button
//           className={`${styles.tab} ${activeTab === "send" ? styles.tabActive : ""}`}
//           onClick={() => setActiveTab("send")}
//         >
//           <Send size={15} />
//           Send Message
//         </button>
//         <button
//           className={`${styles.tab} ${activeTab === "inbox" ? styles.tabActive : ""}`}
//           onClick={() => setActiveTab("inbox")}
//         >
//           <MessageSquare size={15} />
//           Volunteer Inbox
//           {unreadCount > 0 && (
//             <span className={styles.tabBadge}>{unreadCount}</span>
//           )}
//         </button>
//       </div>

//       {/* SEND MESSAGE TAB */}
//       {activeTab === "send" && (
//         <div className={styles.panel}>
//           <div className={styles.panelHeader}>
//             <h2 className={styles.panelTitle}>Send Message</h2>
//             <p className={styles.panelSub}>
//               Search by name or email — select a volunteer from the dropdown, then type your message.
//             </p>
//           </div>

//           <div className={styles.form}>
//             <div className={styles.searchContainer} ref={searchRef}>
//               <label className={styles.fieldLabel}>Select Volunteer</label>
//               <div className={styles.searchWrap}>
//                 <Search size={16} className={styles.searchIcon} />
//                 <input
//                   className={styles.searchInput}
//                   placeholder="Type a name or email to search..."
//                   value={searchQuery}
//                   onChange={(e) => {
//                     setSearchQuery(e.target.value);
//                     setSelectedVolunteer(null);
//                   }}
//                   onFocus={() => { if (volunteers.length > 0) setShowDropdown(true); }}
//                   autoComplete="off"
//                 />
//                 {searchQuery && (
//                   <button className={styles.clearBtn} onClick={handleClear}>
//                     <X size={14} />
//                   </button>
//                 )}
//               </div>

//               {showDropdown && !selectedVolunteer && (
//                 <div className={styles.dropdown}>
//                   {searchLoading && (
//                     <div className={styles.dropdownLoading}>Searching...</div>
//                   )}
//                   {!searchLoading && volunteers.length === 0 && (
//                     <div className={styles.dropdownEmpty}>No volunteers found</div>
//                   )}
//                   {!searchLoading && volunteers.map((v) => (
//                     <div
//                       key={v.volunteer_id}
//                       className={styles.dropdownItem}
//                       onMouseDown={() => handleSelectVolunteer(v)}
//                     >
//                       <div className={styles.dropdownAvatar}>
//                         {v.name?.charAt(0).toUpperCase()}
//                       </div>
//                       <div className={styles.dropdownInfo}>
//                         <p className={styles.dropdownName}>{v.name}</p>
//                         <p className={styles.dropdownEmail}>{v.email}</p>
//                         {v.skills && (
//                           <p className={styles.dropdownSkills}>Skills: {v.skills}</p>
//                         )}
//                       </div>
//                       <div className={styles.dropdownId}>ID #{v.volunteer_id}</div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {selectedVolunteer && (
//               <div className={styles.selectedTag}>
//                 <div className={styles.selectedAvatar}>
//                   {selectedVolunteer.name?.charAt(0).toUpperCase()}
//                 </div>
//                 <div className={styles.selectedInfo}>
//                   <span className={styles.selectedName}>{selectedVolunteer.name}</span>
//                   <span className={styles.selectedEmail}>{selectedVolunteer.email}</span>
//                 </div>
//                 <button className={styles.selectedClear} onClick={handleClear}>
//                   <X size={14} />
//                 </button>
//               </div>
//             )}

//             <div>
//               <label className={styles.fieldLabel}>Message</label>
//               <textarea
//                 className={styles.textarea}
//                 placeholder="Type your message here..."
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 rows={5}
//               />
//             </div>

//             {successMsg && (
//               <div className={styles.successMsg}>
//                 <CheckCircle size={16} />
//                 {successMsg}
//               </div>
//             )}

//             <button
//               className={styles.sendBtn}
//               onClick={handleSend}
//               disabled={!selectedVolunteer || !message.trim() || sending}
//             >
//               <Send size={16} />
//               {sending ? "Sending..." : "Send Message"}
//             </button>
//           </div>
//         </div>
//       )}

//       {/* INBOX TAB */}
//       {activeTab === "inbox" && (
//         <div className={styles.panel}>
//           <div className={styles.panelHeader}>
//             <h2 className={styles.panelTitle}>Messages from Volunteers</h2>
//             <p className={styles.panelSub}>
//               {inbox.length} message{inbox.length !== 1 ? "s" : ""} received — reply directly from here.
//             </p>
//           </div>

//           {inbox.length === 0 ? (
//             <div className={styles.emptyState}>
//               <MessageSquare size={36} color="#94a3b8" />
//               <p>No messages yet</p>
//               <span>Volunteer replies will appear here.</span>
//             </div>
//           ) : (
//             <div className={styles.inboxList}>
//               {inbox.map((msg) => (
//                 <InboxItem
//                   key={msg.notification_id}
//                   msg={msg}
//                   token={token}
//                   onReplySent={fetchInbox}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useRef } from "react";
import {
  Send, Search, Clock, CheckCircle,
  MessageSquare, X, ChevronDown, ChevronUp, Inbox
} from "lucide-react";
import styles from "./notifications.module.css";

function InboxItem({ msg, token, onReplySent }) {
  const [showReply, setShowReply] = useState(false);
  const [reply, setReply]         = useState("");
  const [sending, setSending]     = useState(false);
  const [sent, setSent]           = useState(false);

  const handleReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      const res = await fetch("http://localhost:5000/api/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          volunteer_id: msg.volunteer_id,
          message: reply.trim(),
        }),
      });
      if (res.ok) {
        setSent(true);
        setReply("");
        setShowReply(false);
        if (onReplySent) onReplySent();
      }
    } catch {}
    setSending(false);
  };

  return (
    <div className={`${styles.inboxItem} ${!msg.is_read ? styles.inboxUnread : ""}`}>
      <div className={styles.inboxAvatar}>
        {msg.volunteer_name?.charAt(0).toUpperCase()}
      </div>
      <div className={styles.inboxContent}>
        <div className={styles.inboxTop}>
          <span className={styles.inboxName}>{msg.volunteer_name}</span>
          <span className={styles.inboxEmail}>{msg.volunteer_email}</span>
          <span className={styles.inboxTime}>
            <Clock size={11} />
            {msg.sent_at
              ? new Date(msg.sent_at).toLocaleDateString("en-US", {
                  month: "short", day: "numeric",
                  hour: "2-digit", minute: "2-digit"
                })
              : "Recently"}
          </span>
        </div>
        <p className={styles.inboxMsg}>{msg.message}</p>

        <div className={styles.inboxActions}>
          {!msg.is_read && <span className={styles.unreadBadge}>New</span>}
          {sent ? (
            <p className={styles.replySentMsg}>
              <CheckCircle size={13} /> Reply sent!
            </p>
          ) : (
            <button
              className={styles.replyToggle}
              onClick={() => setShowReply(!showReply)}
            >
              {showReply ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              {showReply ? "Cancel" : "Reply"}
            </button>
          )}
        </div>

        {showReply && !sent && (
          <div className={styles.replyBox}>
            <textarea
              className={styles.replyTextarea}
              placeholder={`Reply to ${msg.volunteer_name}...`}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={3}
            />
            <button
              className={styles.replyBtn}
              onClick={handleReply}
              disabled={!reply.trim() || sending}
            >
              <Send size={13} />
              {sending ? "Sending..." : "Send Reply"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SentItem({ msg }) {
  return (
    <div className={styles.inboxItem}>
      <div className={styles.sentAvatar}>
        {msg.volunteer_name?.charAt(0).toUpperCase()}
      </div>
      <div className={styles.inboxContent}>
        <div className={styles.inboxTop}>
          <span className={styles.inboxName}>To: {msg.volunteer_name}</span>
          <span className={styles.inboxEmail}>{msg.volunteer_email}</span>
          <span className={styles.inboxTime}>
            <Clock size={11} />
            {msg.sent_at
              ? new Date(msg.sent_at).toLocaleDateString("en-US", {
                  month: "short", day: "numeric",
                  hour: "2-digit", minute: "2-digit"
                })
              : "Recently"}
          </span>
        </div>
        <p className={styles.inboxMsg}>{msg.message}</p>
        <span className={styles.sentBadge}>
          <Send size={10} /> Sent
        </span>
      </div>
    </div>
  );
}

export default function AdminNotificationsPage() {
  const [searchQuery, setSearchQuery]             = useState("");
  const [volunteers, setVolunteers]               = useState([]);
  const [showDropdown, setShowDropdown]           = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [message, setMessage]                     = useState("");
  const [inbox, setInbox]                         = useState([]);
  const [sent, setSent]                           = useState([]);
  const [sending, setSending]                     = useState(false);
  const [successMsg, setSuccessMsg]               = useState("");
  const [activeTab, setActiveTab]                 = useState("send");
  const [searchLoading, setSearchLoading]         = useState(false);
  const searchRef                                 = useRef(null);

  const token = typeof window !== "undefined"
    ? localStorage.getItem("access_token")
    : null;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search volunteers
  useEffect(() => {
    const fetchVolunteers = async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/notifications/search-volunteers?q=${searchQuery}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) {
          const data = await res.json();
          setVolunteers(data);
          setShowDropdown(true);
        }
      } catch {}
      setSearchLoading(false);
    };
    const timer = setTimeout(() => { fetchVolunteers(); }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch inbox (volunteer messages)
  const fetchInbox = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/notifications/admin/inbox", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setInbox(data);
      }
    } catch {}
  };

  // Fetch sent messages (admin → volunteer)
  const fetchSent = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/notifications/admin/sent", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSent(data);
      }
    } catch {}
  };

  useEffect(() => {
    if (activeTab === "inbox") fetchInbox();
    if (activeTab === "sent")  fetchSent();
  }, [activeTab]);

  const handleSelectVolunteer = (v) => {
    setSelectedVolunteer(v);
    setSearchQuery(v.name);
    setShowDropdown(false);
  };

  const handleClear = () => {
    setSelectedVolunteer(null);
    setSearchQuery("");
    setVolunteers([]);
    setShowDropdown(false);
  };

  const handleSend = async () => {
    if (!selectedVolunteer || !message.trim()) return;
    setSending(true);
    try {
      const res = await fetch("http://localhost:5000/api/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          volunteer_id: selectedVolunteer.volunteer_id,
          message: message.trim(),
        }),
      });
      if (res.ok) {
        setSuccessMsg(`Message sent to ${selectedVolunteer.name}!`);
        setMessage("");
        handleClear();
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch {}
    setSending(false);
  };

  const unreadCount = inbox.filter((m) => !m.is_read).length;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Notifications</h1>
        <p className={styles.subtitle}>Send messages to volunteers and manage conversations</p>
      </div>

      {/* TABS */}
      <div className={styles.tabsRow}>
        <button
          className={`${styles.tab} ${activeTab === "send" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("send")}
        >
          <Send size={15} />
          Send Message
        </button>
        <button
          className={`${styles.tab} ${activeTab === "inbox" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("inbox")}
        >
          <MessageSquare size={15} />
          Volunteer Inbox
          {unreadCount > 0 && (
            <span className={styles.tabBadge}>{unreadCount}</span>
          )}
        </button>
        <button
          className={`${styles.tab} ${activeTab === "sent" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("sent")}
        >
          <Inbox size={15} />
          Sent Messages
          {sent.length > 0 && (
            <span className={styles.tabBadgeSent}>{sent.length}</span>
          )}
        </button>
      </div>

      {/* SEND MESSAGE TAB */}
      {activeTab === "send" && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Send Message</h2>
            <p className={styles.panelSub}>
              Search by name or email — select a volunteer from the dropdown, then type your message.
            </p>
          </div>

          <div className={styles.form}>
            <div className={styles.searchContainer} ref={searchRef}>
              <label className={styles.fieldLabel}>Select Volunteer</label>
              <div className={styles.searchWrap}>
                <Search size={16} className={styles.searchIcon} />
                <input
                  className={styles.searchInput}
                  placeholder="Type a name or email to search..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedVolunteer(null);
                  }}
                  onFocus={() => { if (volunteers.length > 0) setShowDropdown(true); }}
                  autoComplete="off"
                />
                {searchQuery && (
                  <button className={styles.clearBtn} onClick={handleClear}>
                    <X size={14} />
                  </button>
                )}
              </div>

              {showDropdown && !selectedVolunteer && (
                <div className={styles.dropdown}>
                  {searchLoading && (
                    <div className={styles.dropdownLoading}>Searching...</div>
                  )}
                  {!searchLoading && volunteers.length === 0 && (
                    <div className={styles.dropdownEmpty}>No volunteers found</div>
                  )}
                  {!searchLoading && volunteers.map((v) => (
                    <div
                      key={v.volunteer_id}
                      className={styles.dropdownItem}
                      onMouseDown={() => handleSelectVolunteer(v)}
                    >
                      <div className={styles.dropdownAvatar}>
                        {v.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className={styles.dropdownInfo}>
                        <p className={styles.dropdownName}>{v.name}</p>
                        <p className={styles.dropdownEmail}>{v.email}</p>
                        {v.skills && (
                          <p className={styles.dropdownSkills}>Skills: {v.skills}</p>
                        )}
                      </div>
                      <div className={styles.dropdownId}>ID #{v.volunteer_id}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedVolunteer && (
              <div className={styles.selectedTag}>
                <div className={styles.selectedAvatar}>
                  {selectedVolunteer.name?.charAt(0).toUpperCase()}
                </div>
                <div className={styles.selectedInfo}>
                  <span className={styles.selectedName}>{selectedVolunteer.name}</span>
                  <span className={styles.selectedEmail}>{selectedVolunteer.email}</span>
                </div>
                <button className={styles.selectedClear} onClick={handleClear}>
                  <X size={14} />
                </button>
              </div>
            )}

            <div>
              <label className={styles.fieldLabel}>Message</label>
              <textarea
                className={styles.textarea}
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
              />
            </div>

            {successMsg && (
              <div className={styles.successMsg}>
                <CheckCircle size={16} />
                {successMsg}
              </div>
            )}

            <button
              className={styles.sendBtn}
              onClick={handleSend}
              disabled={!selectedVolunteer || !message.trim() || sending}
            >
              <Send size={16} />
              {sending ? "Sending..." : "Send Message"}
            </button>
          </div>
        </div>
      )}

      {/* INBOX TAB */}
      {activeTab === "inbox" && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Messages from Volunteers</h2>
            <p className={styles.panelSub}>
              {inbox.length} message{inbox.length !== 1 ? "s" : ""} received — reply directly from here.
            </p>
          </div>
          {inbox.length === 0 ? (
            <div className={styles.emptyState}>
              <MessageSquare size={36} color="#94a3b8" />
              <p>No messages yet</p>
              <span>Volunteer replies will appear here.</span>
            </div>
          ) : (
            <div className={styles.inboxList}>
              {inbox.map((msg) => (
                <InboxItem
                  key={msg.notification_id}
                  msg={msg}
                  token={token}
                  onReplySent={fetchInbox}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* SENT TAB */}
      {activeTab === "sent" && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Sent Messages</h2>
            <p className={styles.panelSub}>
              {sent.length} message{sent.length !== 1 ? "s" : ""} sent to volunteers.
            </p>
          </div>
          {sent.length === 0 ? (
            <div className={styles.emptyState}>
              <Send size={36} color="#94a3b8" />
              <p>No sent messages yet</p>
              <span>Messages you send to volunteers will appear here.</span>
            </div>
          ) : (
            <div className={styles.inboxList}>
              {sent.map((msg) => (
                <SentItem key={msg.notification_id} msg={msg} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}