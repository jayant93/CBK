import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import { motion } from 'framer-motion';

export default function Profile({ user }){
  const [links,setLinks]=useState(null);

  useEffect(()=>{
    if(!user?.phone) return;
    const r = ref(db,'users/'+user.phone);
    const unsub = onValue(r,snap=>{
      setLinks(snap.exists()?snap.val().links:null);
    });
    return ()=>unsub();
  },[user]);

  if(!links) return null;
  return (
    <motion.div className='card' initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.5}}>
      <h3>Your current links 💫</h3>
      <div style={{display:'grid',gap:8}}>
        {Object.entries(links).map(([k,v])=> v ? <div key={k} style={{background:'rgba(255,255,255,0.03)',padding:10,borderRadius:10}}><strong>{k}:</strong> {v}</div> : null)}
      </div>
    </motion.div>
  );
}
