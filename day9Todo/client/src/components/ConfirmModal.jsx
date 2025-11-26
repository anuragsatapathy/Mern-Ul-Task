import React from 'react';

export default function ConfirmModal({ open, title='Confirm', message, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div style={{position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center', zIndex:50}}>
      <div onClick={onCancel} style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.4)'}} />
      <div style={{background:'#fff', padding:20, borderRadius:8, zIndex:60, width:'90%', maxWidth:430}}>
        <h3 style={{margin:0, marginBottom:8}}>{title}</h3>
        <p style={{marginTop:0}}>{message}</p>
        <div style={{display:'flex', justifyContent:'flex-end', gap:8}}>
          <button onClick={onCancel} style={{padding:'8px 12px'}}>Cancel</button>
          <button onClick={onConfirm} style={{padding:'8px 12px', background:'#e11', color:'#fff', border:'none', borderRadius:4}}>Delete</button>
        </div>
      </div>
    </div>
  );
}
