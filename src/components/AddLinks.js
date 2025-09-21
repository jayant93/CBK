import React, { useState, useEffect } from "react";
import { ref, set, onValue, get, child } from "firebase/database";
import { db } from "../firebase";
import { motion } from "framer-motion";

const generateId = () => Math.random().toString(36).substring(2, 8);

export default function AddLinks() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState(null); // null | "checking" | "available" | "taken"
  const [links, setLinks] = useState({
    facebook: "",
    instagram: "",
    whatsapp: "",
    email: ""
  });
  const [customLinks, setCustomLinks] = useState([]);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);

  // preload if phone exists
  useEffect(() => {
    if (!phone) return;
    const r = ref(db, "users/" + phone);
    const unsub = onValue(r, (snap) => {
      const data = snap.val();
      if (data) {
        setName(data.name || "");
        setLinks(data.links || { facebook: "", instagram: "", whatsapp: "", email: "" });
        setCustomLinks(data.custom || []);
        setUsername(data.username || "");
        if (data.username) {
          setShareLink(`${window.location.origin}/u/${data.username}`);
        }
      }
    });
    return () => unsub();
  }, [phone]);

  const handle = (k, v) => setLinks((p) => ({ ...p, [k]: v }));

  // check username availability
  useEffect(() => {
    const input = username.trim().toLowerCase();
    if (!input) {
      setUsernameStatus(null);
      return;
    }

    const check = async () => {
      setUsernameStatus("checking");
      const snap = await get(child(ref(db), "public/" + input));
      if (snap.exists()) {
        const existingPhone = snap.val();
        if (existingPhone === phone) {
          setUsernameStatus("available"); // belongs to same user
        } else {
          setUsernameStatus("taken");
        }
      } else {
        setUsernameStatus("available");
      }
    };

    const debounce = setTimeout(check, 600);
    return () => clearTimeout(debounce);
  }, [username, phone]);

  // custom links handlers
  const addCustom = () => setCustomLinks([...customLinks, { label: "", url: "" }]);
  const handleCustomChange = (i, field, value) => {
    const updated = [...customLinks];
    updated[i][field] = value;
    setCustomLinks(updated);
  };
  const removeCustom = (i) => {
    const updated = [...customLinks];
    updated.splice(i, 1);
    setCustomLinks(updated);
  };

  const save = async () => {
    if (!phone.trim() || !name.trim()) return alert("Enter both Name and Phone!");

    let finalUsername = username.trim().toLowerCase();
    if (!finalUsername) {
      finalUsername = generateId();
    }

    if (usernameStatus === "taken") {
      alert("❌ Username already taken, please choose another.");
      return;
    }

    const payload = { name, phone, links, custom: customLinks, username: finalUsername };
    try {
      await set(ref(db, "users/" + phone), payload);
      await set(ref(db, "public/" + finalUsername), phone);
      setUsername(finalUsername);
      setShareLink(`${window.location.origin}/u/${finalUsername}`);
      setCopied(false);
      alert("Saved 🎉");
    } catch (err) {
      console.error(err);
      alert("Error saving: " + err.message);
    }
  };

  const copyLink = () => {
    if (!shareLink) return;
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  // Generate username suggestions
  const getSuggestions = () => {
    const base = username.trim().toLowerCase();
    if (!base) return [];
    return [base + "1", base + "123", base + "x"];
  };

  return (
    <motion.div
      className="card"
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
    >
      <h2>👋 Welcome to CKB!</h2>
      <p className="small muted">
        Fill your <b>Name</b>, <b>Phone</b>, and choose a <b>Username</b> (for your public link).  
        Usernames are always lowercase. Don’t worry — your phone stays private 🔒.
      </p>

      <input placeholder="👑 Your Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="📱 Phone (used internally, not shared)" value={phone} onChange={(e) => setPhone(e.target.value)} />

      <div style={{ position: "relative", marginBottom: "6px" }}>
        <input
          placeholder="✨ Username (for your shareable link)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      {/* Status message below input */}
      {usernameStatus === "checking" && (
        <p style={{ color: "#aaa", fontSize: 13, margin: "2px 0" }}>
          ⏳ Checking availability…
        </p>
      )}
      {usernameStatus === "available" && (
        <p style={{ color: "limegreen", fontSize: 13, margin: "2px 0" }}>
          ✅ Username available 🎉
        </p>
      )}
      {usernameStatus === "taken" && (
        <div
          style={{
            fontSize: 13,
            margin: "2px 0",
            fontWeight: "bold",
            animation: "blink 1s infinite"
          }}
        >
          <p style={{ color: "red", margin: 0 }}>
            ❌ This username is already taken 😢
          </p>
          <p style={{ color: "#ffcc00", margin: 0 }}>
            ✨ Try:{" "}
            {getSuggestions().map((s, i) => (
              <span
                key={i}
                onClick={() => setUsername(s)}
                style={{
                  marginLeft: 6,
                  cursor: "pointer",
                  background: "#333",
                  padding: "2px 6px",
                  borderRadius: "6px",
                  color: "#fff"
                }}
              >
                {s}
              </span>
            ))}
          </p>
        </div>
      )}

      {/* fixed links */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
        <input placeholder="Facebook URL" value={links.facebook} onChange={(e) => handle("facebook", e.target.value)} />
        <input placeholder="Instagram URL" value={links.instagram} onChange={(e) => handle("instagram", e.target.value)} />
        <input placeholder="WhatsApp (optional)" value={links.whatsapp} onChange={(e) => handle("whatsapp", e.target.value)} />
        <input placeholder="Email" value={links.email} onChange={(e) => handle("email", e.target.value)} />
      </div>

      {/* dynamic custom links */}
      <div style={{ marginTop: 20 }}>
        <h4>✨ Extra Links</h4>
        {customLinks.map((c, i) => (
          <motion.div
            key={i}
            style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <input
              placeholder="Label (e.g. YouTube)"
              value={c.label}
              onChange={(e) => handleCustomChange(i, "label", e.target.value)}
            />
            <input
              placeholder="URL"
              value={c.url}
              onChange={(e) => handleCustomChange(i, "url", e.target.value)}
            />
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => removeCustom(i)}
              style={{
                border: "none",
                borderRadius: "50%",
                width: 32,
                height: 32,
                background: "linear-gradient(135deg, #ff4e50, #f9d423)",
                color: "#fff",
                cursor: "pointer",
                fontSize: 16,
                lineHeight: "32px"
              }}
              title="Remove this link"
            >
              🗑️
            </motion.button>
          </motion.div>
        ))}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addCustom}
          style={{
            marginTop: 8,
            padding: "10px 18px",
            borderRadius: 20,
            border: "none",
            cursor: "pointer",
            background: "linear-gradient(90deg,#ff6ec4,#7873f5)",
            color: "#fff",
            fontSize: 14,
            fontWeight: "bold",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
          }}
        >
          ✨ Add New Link
        </motion.button>
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
        <button className="btn" style={{ background: "#fff", color: "#ff4ecd" }} onClick={save}>
          💾 Save & Get Link
        </button>
      </div>

      {shareLink && (
        <div className="share-row">
          <input value={shareLink} readOnly style={{ flex: 1, borderRadius: 12, padding: 10 }} />
          <button className="btn" style={{ background: "#fff", color: "#4efcff" }} onClick={copyLink}>
            {copied ? "Copied ✅" : "Copy Link 📋"}
          </button>
          <a
            className="btn"
            style={{ background: "#000", color: "#fff" }}
            href={shareLink}
            target="_blank"
            rel="noreferrer"
          >
            Open 🔗
          </a>
        </div>
      )}
    </motion.div>
  );
}
