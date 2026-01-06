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
import { toast } from "react-toastify";
import api from "../api/api";
import EmptyState from "../components/EmptyState";

/* DOT RATING  */
const DotRating = ({ value = 0, onChange, readOnly = false }) => (
  <Box display="flex" gap={1}>
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
  summary: "",
  headline: "",

  profileImage: null,
  profileImagePreview: null,
  profileImageName: "", 

  // strengths
  strengthTitle: "",
  strengthDesc: "",
  strengths: [],
  editStrengthIndex: null,

  // languages
  languageName: "",
  languageLevel: "Native",
  languageRating: 0,
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

  /* FETCH  */
  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      if (res.data.data) {
        const data = res.data.data;

        setProfile(data);
        setForm({
          ...emptyForm,
          ...data,
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

  /*  VALIDATION */
  const validate = () => {
    const e = {};
    if (!form.fullName) e.fullName = "Full name is required";
    if (!form.email) e.email = "Email is required";
    else if (!emailRegex.test(form.email)) e.email = "Enter valid email";
    if (!form.phone) e.phone = "Phone is required";
    else if (!phoneRegex.test(form.phone)) e.phone = "Phone must be 10 digits";
    if (!form.address) e.address = "Address is required";
    if (!form.linkedinId) e.linkedinId = "LinkedIn is required";
    if (!form.summary) e.summary = "Summary is required";
    if (!form.headline) e.headline = "Headline is required";

    setErrors(e);
    if (Object.keys(e).length) {
      toast.error("Please fix the highlighted errors");
      return false;
    }
    return true;
  };

  /* STRENGTH */
  const addOrUpdateStrength = () => {
    if (!form.strengthTitle || !form.strengthDesc) {
      toast.error("Enter strength title and description");
      return;
    }

    let updated = [...form.strengths];

    const obj = {
      title: form.strengthTitle,
      description: form.strengthDesc,
    };

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

  /*  LANGUAGE  */
  const addOrUpdateLanguage = () => {
    if (!form.languageName || !form.languageRating) {
      toast.error("Enter language and select rating");
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
      languageRating: 0,
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
      fd.append("summary", form.summary);
      fd.append("headline", form.headline);

      if (form.profileImage) fd.append("profileImage", form.profileImage);

      fd.append("strengths", JSON.stringify(form.strengths));
      fd.append(
        "languages",
        JSON.stringify(
          form.languages.map((l) => ({
            ...l,
            rating: Number(l.rating),
          }))
        )
      );

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
      <Typography variant="h4" mb={2}>Profile</Typography>

      {!profile && (
        <>
          <Button variant="contained" onClick={() => setOpen(true)}>
            ADD PROFILE
          </Button>
          <EmptyState text="No profile data added yet." />
        </>
      )}

      {profile && (
        <Box display="flex" justifyContent="center">
          <Card
            sx={{
              mt: 3,
              p: 3,
              width: "100%",
              maxWidth: 850,
              minHeight: 420,
              borderRadius: 4,
              position: "relative",
              background:
                "linear-gradient(135deg, #E3F2FD 0%, #FCE4EC 100%)",
              boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
              transition: "0.3s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
              },
            }}
          >
            <Box position="absolute" top={12} right={12}>
              <IconButton onClick={() => setOpen(true)}><EditIcon /></IconButton>
              <IconButton color="error" onClick={() => setConfirmOpen(true)}>
                <DeleteIcon />
              </IconButton>
            </Box>

            {profile.profileImage && (
              <img
                src={`http://localhost:5000${profile.profileImage}`}
                alt="profile"
                style={{ width: 80, height: 80, borderRadius: "50%" }}
              />
            )}

            <Typography variant="h5" fontWeight={700}>
              {profile.fullName}
            </Typography>
            <Typography color="primary" fontWeight={600}>
              {profile.headline}
            </Typography>

            <Stack direction="row" alignItems="center" spacing={1.2}>
              <EmailIcon fontSize="small" sx={{ color: "#000" }} />
              <Typography>{profile.email}</Typography>
              <PhoneIcon fontSize="small" sx={{ color: "#000" }} />
              <Typography>{profile.phone}</Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1.2}>
              <LocationOnIcon fontSize="small" sx={{ color: "#000" }} />
              <Typography>{profile.address}</Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1.2}>
              <LinkedInIcon fontSize="small" sx={{ color: "#1976d2" }} />
              <Typography color="primary">
                {profile.linkedinId}
              </Typography>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography fontWeight={600}>Professional Summary</Typography>
            <Typography>{profile.summary}</Typography>

            {profile.strengths?.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography fontWeight={600}>Strengths</Typography>
                {profile.strengths.map((s, i) => (
                  <Box key={i}>
                    <Typography fontWeight={600}>{s.title}</Typography>
                    <Typography>{s.description}</Typography>
                  </Box>
                ))}
              </>
            )}

            {profile.languages?.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography fontWeight={600}>Languages</Typography>
                {profile.languages.map((l, i) => (
                  <Stack key={i} direction="row" justifyContent="space-between">
                    <Typography>{l.name} – {l.level}</Typography>
                    <DotRating value={Number(l.rating)} readOnly />
                  </Stack>
                ))}
              </>
            )}
          </Card>
        </Box>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{profile ? "Edit Profile" : "Add Profile"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <TextField label="Full Name" value={form.fullName}
              onChange={(e)=>setForm({...form,fullName:e.target.value})} />
            <TextField label="Email" value={form.email}
              onChange={(e)=>setForm({...form,email:e.target.value})} />
            <TextField label="Phone" value={form.phone}
              onChange={(e)=>setForm({...form,phone:e.target.value})} />
            <TextField label="Address" value={form.address}
              onChange={(e)=>setForm({...form,address:e.target.value})} />
            <TextField label="LinkedIn" value={form.linkedinId}
              onChange={(e)=>setForm({...form,linkedinId:e.target.value})} />
            <TextField label="Summary" multiline rows={3}
              value={form.summary}
              onChange={(e)=>setForm({...form,summary:e.target.value})} />
            <TextField label="Headline"
              value={form.headline}
              onChange={(e)=>setForm({...form,headline:e.target.value})} />

            {/* IMAGE */}
            <Button component="label" variant="outlined">
              Upload Profile Image
              {(form.profileImage?.name || form.profileImageName) && (
                <Typography variant="caption" sx={{ ml: 1 }}>
                  {form.profileImage?.name || form.profileImageName}
                </Typography>
              )}
              <input hidden type="file" accept="image/*"
                onChange={(e)=>{
                  const f=e.target.files[0];
                  if(!f)return;
                  setForm({...form,
                    profileImage:f,
                    profileImagePreview:URL.createObjectURL(f),
                    profileImageName:f.name, // ✅ FIX
                  });
                }} />
            </Button>

            {/* STRENGTH  */}
            <Divider />
            <Typography fontWeight={600}>Strength</Typography>

            <TextField label="Strength Title"
              value={form.strengthTitle}
              onChange={(e)=>setForm({...form,strengthTitle:e.target.value})}/>
            <TextField label="Strength Description" multiline rows={2}
              value={form.strengthDesc}
              onChange={(e)=>setForm({...form,strengthDesc:e.target.value})}/>
            <Button onClick={addOrUpdateStrength}>
              {form.editStrengthIndex !== null ? "Update Strength" : "Add Strength"}
            </Button>

            {form.strengths.map((s,i)=>(
              <Stack key={i} direction="row" justifyContent="space-between">
                <Box>
                  <Typography fontWeight={600}>{s.title}</Typography>
                  <Typography>{s.description}</Typography>
                </Box>
                <Box>
                  <IconButton onClick={()=>editStrength(s,i)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={()=>deleteStrength(i)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Stack>
            ))}

            {/* LANGUAGE */}
            <Divider />
            <Typography fontWeight={600}>Language</Typography>

            <TextField label="Language"
              value={form.languageName}
              onChange={(e)=>setForm({...form,languageName:e.target.value})}/>
            <TextField select label="Level"
              value={form.languageLevel}
              onChange={(e)=>setForm({...form,languageLevel:e.target.value})}>
              <MenuItem value="Native">Native</MenuItem>
              <MenuItem value="Advanced">Advanced</MenuItem>
              <MenuItem value="Intermediate">Intermediate</MenuItem>
              <MenuItem value="Beginner">Beginner</MenuItem>
            </TextField>

            <DotRating value={form.languageRating}
              onChange={(n)=>setForm({...form,languageRating:Number(n)})} />

            <Button onClick={addOrUpdateLanguage}>
              {form.editLanguageIndex !== null ? "Update Language" : "Add Language"}
            </Button>

            {form.languages.map((l,i)=>(
              <Stack key={i} direction="row" justifyContent="space-between">
                <Typography>{l.name} – {l.level}</Typography>
                <Box display="flex" gap={1}>
                  <DotRating value={Number(l.rating)} readOnly />
                  <IconButton onClick={()=>editLanguage(l,i)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={()=>deleteLanguage(i)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Stack>
            ))}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={()=>setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={save}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRM */}
      <Dialog open={confirmOpen} onClose={()=>setConfirmOpen(false)}>
        <DialogTitle>Delete profile?</DialogTitle>
        <DialogActions>
          <Button onClick={()=>setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" onClick={remove}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
