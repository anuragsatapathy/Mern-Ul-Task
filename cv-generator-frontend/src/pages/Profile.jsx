import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Stack,
  Divider,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import { toast } from "react-toastify";
import api from "../api/api";
import EmptyState from "../components/EmptyState";

/* DOT RATING */
const DotRating = ({ value = 0, onChange, readOnly = false }) => (
  <Box display="flex" gap={0.5}>
    {[1, 2, 3, 4, 5].map((n) => (
      <Box
        key={n}
        onClick={() => !readOnly && onChange(n)}
        sx={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          cursor: readOnly ? "default" : "pointer",
          backgroundColor: n <= value ? "#1976d2" : "#ccc",
        }}
      />
    ))}
  </Box>
);

const emptyForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  linkedinId: "",
  xId: "",
  summary: "",
  headline: "",
  profileImage: null,
  profileImagePreview: null,
  profileImageName: "",
  strengthTitle: "",
  strengthDesc: "",
  strengths: [],
  editStrengthIndex: null,
  languageName: "",
  languageLevel: "Native",
  languageRating: 5,
  languages: [],
  editLanguageIndex: null,
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10}$/;

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const levelRatings = {
      Native: 5,
      Proficiency: 4,
      Advanced: 3,
      Intermediate: 2,
      Beginner: 1,
    };
    setForm((prev) => ({
      ...prev,
      languageRating: levelRatings[prev.languageLevel] || 0,
    }));
  }, [form.languageLevel]);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      if (res.data.data) {
        const data = res.data.data;
        setProfile(data);
        setForm({
          ...emptyForm,
          ...data,
          xId: data.xId || "",
          strengths: data.strengths || [],
          languages: (data.languages || []).map((l) => ({
            ...l,
            rating: Number(l.rating) || 0,
          })),
          profileImagePreview: data.profileImage
            ? `http://localhost:5000${data.profileImage}`
            : null,
          profileImageName: data.profileImage
            ? data.profileImage.split("/").pop()
            : "",
        });
      } else {
        setProfile(null);
        setForm(emptyForm);
      }
    } catch {
      setProfile(null);
      setForm(emptyForm);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const validate = () => {
    const e = {};
    if (!form.fullName) e.fullName = "Full name is required";
    if (!form.email) e.email = "Email is required";
    else if (!emailRegex.test(form.email)) e.email = "Enter valid email";
    if (!form.phone) e.phone = "Phone is required";
    else if (!phoneRegex.test(form.phone)) e.phone = "Phone must be 10 digits";
    if (!form.address) e.address = "Address is required";
    if (!form.linkedinId) e.linkedinId = "LinkedIn is required";
    if (!form.xId) e.xId = "X ID is required";
    if (!form.summary) e.summary = "Summary is required";
    if (!form.headline) e.headline = "Headline is required";

    setErrors(e);
    if (Object.keys(e).length) {
      toast.error("Please fix the highlighted errors");
      return false;
    }
    return true;
  };

  const addOrUpdateStrength = () => {
    if (!form.strengthTitle || !form.strengthDesc) {
      toast.error("Enter strength title and description");
      return;
    }
    let updated = [...form.strengths];
    const obj = { title: form.strengthTitle, description: form.strengthDesc };
    if (form.editStrengthIndex !== null) {
      updated[form.editStrengthIndex] = obj;
    } else {
      updated.push(obj);
    }
    setForm({
      ...form,
      strengths: updated,
      strengthTitle: "",
      strengthDesc: "",
      editStrengthIndex: null,
    });
  };

  const editStrength = (s, i) => {
    setForm({
      ...form,
      strengthTitle: s.title,
      strengthDesc: s.description,
      editStrengthIndex: i,
    });
  };

  const deleteStrength = (i) => {
    setForm({
      ...form,
      strengths: form.strengths.filter((_, x) => x !== i),
    });
  };

  const addOrUpdateLanguage = () => {
    if (!form.languageName) {
      toast.error("Enter language");
      return;
    }
    let updated = [...form.languages];
    const obj = {
      name: form.languageName,
      level: form.languageLevel,
      rating: Number(form.languageRating),
    };
    if (form.editLanguageIndex !== null) {
      updated[form.editLanguageIndex] = obj;
    } else {
      updated.push(obj);
    }
    setForm({
      ...form,
      languages: updated,
      languageName: "",
      languageLevel: "Native",
      languageRating: 5,
      editLanguageIndex: null,
    });
  };

  const editLanguage = (l, i) => {
    setForm({
      ...form,
      languageName: l.name,
      languageLevel: l.level,
      languageRating: Number(l.rating),
      editLanguageIndex: i,
    });
  };

  const deleteLanguage = (i) => {
    setForm({
      ...form,
      languages: form.languages.filter((_, x) => x !== i),
    });
  };

  const save = async () => {
    if (!validate()) return;
    try {
      const fd = new FormData();
      fd.append("fullName", form.fullName);
      fd.append("email", form.email);
      fd.append("phone", form.phone);
      fd.append("address", form.address);
      fd.append("linkedinId", form.linkedinId);
      fd.append("xId", form.xId);
      fd.append("summary", form.summary);
      fd.append("headline", form.headline);
      if (form.profileImage) fd.append("profileImage", form.profileImage);
      fd.append("strengths", JSON.stringify(form.strengths));
      fd.append("languages", JSON.stringify(form.languages));

      await api.post("/profile", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile saved successfully");
      setOpen(false);
      fetchProfile();
    } catch {
      toast.error("Failed to save profile");
    }
  };

  const remove = async () => {
    try {
      await api.delete("/profile");
      toast.success("Profile deleted");
      setProfile(null);
      setForm(emptyForm);
      setConfirmOpen(false);
    } catch {
      toast.error("Failed to delete profile");
    }
  };

  return (
    <Box>
      <Typography variant="h4" mb={2} fontWeight={600}>Profile</Typography>

      {!profile && (
        <>
          <Button variant="contained" onClick={() => setOpen(true)}>ADD PROFILE</Button>
          <EmptyState text="No profile data added yet." />
        </>
      )}

      {profile && (
        <Box display="flex" justifyContent="center">
          <Card
            sx={{
              mt: 3, p: 4, width: "100%", maxWidth: 850, borderRadius: 4, position: "relative",
              background: "linear-gradient(135deg, #E3F2FD 0%, #FCE4EC 100%)",
              boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
              transition: "0.3s", "&:hover": { transform: "translateY(-4px)", boxShadow: "0 18px 40px rgba(0,0,0,0.18)" },
            }}
          >
            <Box position="absolute" top={16} right={16}>
              <IconButton onClick={() => setOpen(true)}><EditIcon /></IconButton>
              <IconButton color="error" onClick={() => setConfirmOpen(true)}><DeleteIcon /></IconButton>
            </Box>

            <Stack direction="row" spacing={3} alignItems="center" mb={2}>
              {profile.profileImage && (
                <img
                  src={`http://localhost:5000${profile.profileImage}`}
                  alt="profile"
                  style={{ width: 100, height: 100, borderRadius: "50%", objectFit: 'cover', border: '3px solid #fff' }}
                />
              )}
              <Box>
                <Typography variant="h4" fontWeight={800} color="text.primary">{profile.fullName}</Typography>
                <Typography variant="h6" color="primary" sx={{ opacity: 0.9, fontWeight: 600 }}>{profile.headline}</Typography>
              </Box>
            </Stack>

       
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5, mb: 2 }}>
              <Stack 
                component="a" 
                href={`mailto:${profile.email}`} 
                direction="row" 
                alignItems="center" 
                spacing={1} 
                sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { opacity: 0.7 } }}
              >
                <EmailIcon fontSize="small" color="action" />
                <Typography variant="body2" fontWeight={500}>{profile.email}</Typography>
              </Stack>

              <Stack 
                component="a" 
                href={`tel:${profile.phone}`} 
                direction="row" 
                alignItems="center" 
                spacing={1} 
                sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { opacity: 0.7 } }}
              >
                <PhoneIcon fontSize="small" color="action" />
                <Typography variant="body2" fontWeight={500}>{profile.phone}</Typography>
              </Stack>

              <Stack 
                component="a" 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.address)}`} 
                target="_blank"
                direction="row" 
                alignItems="center" 
                spacing={1} 
                sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { opacity: 0.7 } }}
              >
                <LocationOnIcon fontSize="small" color="action" />
                <Typography variant="body2" fontWeight={500}>{profile.address}</Typography>
              </Stack>

              <Stack 
                component="a" 
                href={profile.linkedinId.startsWith('http') ? profile.linkedinId : `https://linkedin.com/in/${profile.linkedinId}`}
                target="_blank"
                direction="row" 
                alignItems="center" 
                spacing={1} 
                sx={{ textDecoration: 'none', '&:hover': { opacity: 0.7 } }}
              >
                <LinkedInIcon fontSize="small" sx={{ color: "#0077b5" }} />
                <Typography variant="body2" fontWeight={600} color="primary.main">
                  {profile.linkedinId.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
                </Typography>
              </Stack>

              <Stack 
                component="a" 
                href={profile.xId.startsWith('http') ? profile.xId : `https://x.com/${profile.xId.replace('@', '')}`}
                target="_blank"
                direction="row" 
                alignItems="center" 
                spacing={1} 
                sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { opacity: 0.7 } }}
              >
                <XIcon sx={{ fontSize: 16, color: "#000" }} />
                <Typography variant="body2" fontWeight={600} color="text.primary">
                  {profile.xId.startsWith('@') ? profile.xId : `@${profile.xId}`}
                </Typography>
              </Stack>
            </Box>

            <Divider sx={{ my: 2, borderColor: 'rgba(0,0,0,0.08)' }} />
            
            <Typography variant="subtitle1" fontWeight={700} color="text.primary" gutterBottom>Professional Summary</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{profile.summary}</Typography>

            {profile.strengths?.length > 0 && (
              <>
                <Divider sx={{ my: 2.5, borderColor: 'rgba(0,0,0,0.08)' }} />
                <Typography variant="subtitle1" fontWeight={700} mb={1.5}>Strengths</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  {profile.strengths.map((s, i) => (
                    <Box key={i}>
                      <Typography fontWeight={700} variant="body2" color="text.primary">{s.title}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>{s.description}</Typography>
                    </Box>
                  ))}
                </Box>
              </>
            )}

            {profile.languages?.length > 0 && (
              <>
                <Divider sx={{ my: 2.5, borderColor: 'rgba(0,0,0,0.08)' }} />
                <Typography variant="subtitle1" fontWeight={700} mb={1.5}>Languages</Typography>
                <Stack direction="row" spacing={4} flexWrap="wrap">
                  {profile.languages.map((l, i) => (
                    <Stack key={i} direction="row" spacing={2} alignItems="center">
                      <Box>
                        <Typography variant="body2" fontWeight={600}>{l.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{l.level}</Typography>
                      </Box>
                      <DotRating value={Number(l.rating)} readOnly />
                    </Stack>
                  ))}
                </Stack>
              </>
            )}
          </Card>
        </Box>
      )}

      {/* DIALOGS */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>{profile ? "Edit Profile" : "Add Profile"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} pt={1}>
            <TextField label="Full Name" fullWidth value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} error={!!errors.fullName} helperText={errors.fullName} />
            <Stack direction="row" spacing={2}>
              <TextField label="Email" fullWidth value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={!!errors.email} helperText={errors.email} />
              <TextField label="Phone" fullWidth value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} error={!!errors.phone} helperText={errors.phone} />
            </Stack>
            <TextField label="Address" fullWidth value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} error={!!errors.address} helperText={errors.address} />
            
            <Stack direction="row" spacing={2}>
               <TextField label="LinkedIn" fullWidth value={form.linkedinId} onChange={(e) => setForm({ ...form, linkedinId: e.target.value })} error={!!errors.linkedinId} helperText={errors.linkedinId} />
               <TextField label="X" fullWidth value={form.xId} onChange={(e) => setForm({ ...form, xId: e.target.value })} error={!!errors.xId} helperText={errors.xId} />
            </Stack>

            <TextField label="Summary" multiline rows={3} fullWidth value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} error={!!errors.summary} helperText={errors.summary} />
            <TextField label="Headline" fullWidth value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} error={!!errors.headline} helperText={errors.headline} />

            <Button component="label" variant="outlined">
              Upload Profile Image
              {(form.profileImage?.name || form.profileImageName) && (
                <Typography variant="caption" sx={{ ml: 1 }}>{form.profileImage?.name || form.profileImageName}</Typography>
              )}
              <input hidden type="file" accept="image/*" onChange={(e) => {
                const f = e.target.files[0];
                if (!f) return;
                setForm({ ...form, profileImage: f, profileImagePreview: URL.createObjectURL(f), profileImageName: f.name });
              }} />
            </Button>

            <Divider />
            <Typography fontWeight={600}>Strength</Typography>
            <TextField label="Strength Title" fullWidth value={form.strengthTitle} onChange={(e) => setForm({ ...form, strengthTitle: e.target.value })} />
            <TextField label="Strength Description" multiline rows={2} fullWidth value={form.strengthDesc} onChange={(e) => setForm({ ...form, strengthDesc: e.target.value })} />
            <Button variant="text" sx={{ alignSelf: 'center' }} onClick={addOrUpdateStrength}>
              {form.editStrengthIndex !== null ? "UPDATE STRENGTH" : "ADD STRENGTH"}
            </Button>

            {form.strengths.map((s, i) => (
              <Box key={i} sx={{ bgcolor: '#f9f9f9', p: 1, borderRadius: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={600} variant="subtitle2">{s.title}</Typography>
                    <Typography variant="caption" color="text.secondary">{s.description}</Typography>
                  </Box>
                  <Stack direction="row">
                    <IconButton size="small" onClick={() => editStrength(s, i)}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => deleteStrength(i)}><DeleteIcon fontSize="small" /></IconButton>
                  </Stack>
                </Stack>
              </Box>
            ))}

            <Divider />
            <Typography fontWeight={600}>Language</Typography>
            <TextField label="Language" fullWidth value={form.languageName} onChange={(e) => setForm({ ...form, languageName: e.target.value })} />
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField select label="Level" fullWidth value={form.languageLevel} onChange={(e) => setForm({ ...form, languageLevel: e.target.value })}>
                <MenuItem value="Native">Native</MenuItem>
                <MenuItem value="Proficiency">Proficiency</MenuItem>
                <MenuItem value="Advanced">Advanced</MenuItem>
                <MenuItem value="Intermediate">Intermediate</MenuItem>
                <MenuItem value="Beginner">Beginner</MenuItem>
              </TextField>
            </Stack>

            <Button variant="text" sx={{ alignSelf: 'center' }} onClick={addOrUpdateLanguage}>
              {form.editLanguageIndex !== null ? "UPDATE LANGUAGE" : "ADD LANGUAGE"}
            </Button>

            {form.languages.map((l, i) => (
              <Box key={i} sx={{ borderBottom: '1px solid #eee', pb: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">{l.name} – {l.level}</Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <DotRating value={Number(l.rating)} readOnly />
                    <IconButton size="small" onClick={() => editLanguage(l, i)}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => deleteLanguage(i)}><DeleteIcon fontSize="small" /></IconButton>
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)}>CANCEL</Button>
          <Button variant="contained" onClick={save}>SAVE</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete profile?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" onClick={remove}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;