import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ref, onValue, get } from "firebase/database";
import { db } from "../firebase";
import { motion } from "framer-motion";

export default function PublicProfile() {
  const { phone: username } = useParams(); // param is actually username now
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!username) return;

    const getData = async () => {
      const phoneSnap = await get(ref(db, "public/" + username));
      if (!phoneSnap.exists()) {
        setData(null);
        return;
      }
      const phone = phoneSnap.val();

      const r = ref(db, "users/" + phone);
      onValue(r, (snap) => {
        setData(snap.exists() ? snap.val() : null);
      });
    };

    getData();
  }, [username]);

  const gradients = [
    "linear-gradient(45deg,#ff6ec4,#7873f5)",
    "linear-gradient(45deg,#f7971e,#ffd200)",
    "linear-gradient(45deg,#00c6ff,#0072ff)",
    "linear-gradient(45deg,#f953c6,#b91d73)",
    "linear-gradient(45deg,#43e97b,#38f9d7)"
  ];

  const pickEmoji = (label) => {
    if (!label) return "🔗";
    const l = label.toLowerCase();
    if (l.includes("youtube")) return "▶️";
    if (l.includes("github")) return "🐙";
    if (l.includes("linkedin")) return "💼";
    if (l.includes("twitter") || l.includes("x")) return "🐦";
    if (l.includes("portfolio") || l.includes("blog")) return "📖";
    return "🔗";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ maxWidth: 420, width: "100%" }}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div
            style={{
              fontFamily: "Bangers, cursive",
              fontSize: 44,
              color: "#fff"
            }}
          >
            👑 {data?.name || "CKB User"} 🔗
          </div>
        </div>

        {data?.links || data?.custom ? (
          <div style={{ display: "grid", gap: 12 }}>
            {data.links?.facebook && (
              <a
                className="social"
                style={{ background: "#1877f2" }}
                href={data.links.facebook}
                target="_blank"
                rel="noreferrer"
              >
                Facebook 📘
              </a>
            )}
            {data.links?.instagram && (
              <a
                className="social"
                style={{
                  background:
                    "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)"
                }}
                href={data.links.instagram}
                target="_blank"
                rel="noreferrer"
              >
                Instagram 📸
              </a>
            )}
            {data.links?.whatsapp && (
              <a
                className="social"
                style={{ background: "#25D366" }}
                href={`https://wa.me/${String(data.links.whatsapp).replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp 💬
              </a>
            )}
            {data.links?.email && (
              <a
                className="social"
                style={{ background: "#ff9800" }}
                href={`mailto:${data.links.email}`}
              >
                Email 📧
              </a>
            )}

            {/* dynamic custom links */}
            {data.custom &&
              data.custom.map(
                (c, i) =>
                  c.url && (
                    <motion.a
                      key={i}
                      className="social"
                      style={{
                        background: gradients[i % gradients.length]
                      }}
                      href={c.url}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {c.label || "Custom"} {pickEmoji(c.label)}
                    </motion.a>
                  )
              )}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.9)"
            }}
          >
            No links added yet 😢
          </div>
        )}
      </motion.div>
    </div>
  );
}
