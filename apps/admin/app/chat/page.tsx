import styles from "./chat.module.css";

export default function ChatPage() {
  return (
    <div className={styles.container}>
      <div className={styles.chatSidebar}>
        <h3>Messages</h3>
        <div className={styles.contactList}>
          <div className={`${styles.contact} ${styles.active}`}>
            <div className={styles.avatar}>R</div>
            <div className={styles.contactInfo}>
              <h4>Roweena Britto</h4>
              <p>Sure, let's discuss step 2...</p>
            </div>
            <span className={styles.badge}>2</span>
          </div>
          <div className={styles.contact}>
            <div className={styles.avatar}>T</div>
            <div className={styles.contactInfo}>
              <h4>Support Team</h4>
              <p>Your invoice is attached.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.chatWindow}>
        <div className={styles.chatHeader}>
          <div className={styles.avatar}>R</div>
          <div>
            <h4>Roweena Britto</h4>
            <p>Online</p>
          </div>
        </div>
        
        <div className={styles.chatMessages}>
          <div className={`${styles.message} ${styles.received}`}>
            <p>Hi John! Welcome to the 11 Steps to U. How are you finding the first step?</p>
            <span className={styles.time}>10:00 AM</span>
          </div>
          <div className={`${styles.message} ${styles.sent}`}>
            <p>It's been incredibly eye-opening. I'm taking a lot of notes.</p>
            <span className={styles.time}>10:05 AM</span>
          </div>
          <div className={`${styles.message} ${styles.received}`}>
            <p>Sure, let's discuss step 2 on our next live call!</p>
            <span className={styles.time}>10:12 AM</span>
          </div>
        </div>
        
        <div className={styles.chatInput}>
          <input type="text" placeholder="Type your message..." />
          <button className={styles.sendBtn}>Send</button>
        </div>
      </div>
    </div>
  );
}
