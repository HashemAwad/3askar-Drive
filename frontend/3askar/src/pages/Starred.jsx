import React from "react";
import { Box, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MenuBar from "../components/MenuBar";
import StarIcon from "@mui/icons-material/Star";
import { useFiles } from "../context/fileContext.jsx";

function Starred() {
  const [sortField, setSortField] = React.useState("name");
  const [sortDirection, setSortDirection] = React.useState("asc");
  const [menuEl, setMenuEl] = React.useState(null);

  const { filteredFiles, filterBySource } = useFiles();
  const starredFiles = React.useMemo(
    () => filterBySource(filteredFiles, "starred"),
    [filteredFiles, filterBySource]
  );

  const handleOpenMenu = (event) => setMenuEl(event.currentTarget);
  const handleCloseMenu = () => setMenuEl(null);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortData = (data) =>
    [...data].sort((a, b) => {
      const resolveValue = (file) => {
        switch (sortField) {
          case "sharedBy":
            return (file.owner || "").toString().toLowerCase();
          case "date":
            return Number(
              new Date(file.lastAccessedAt || file.uploadedAt || file.date)
            );
          default:
            return (file.name || "").toString().toLowerCase();
        }
      };

      const valueA = resolveValue(a);
      const valueB = resolveValue(b);

      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const sortedFiles = sortData(starredFiles);

  const renderSortIndicator = (field) => {
    if (sortField !== field) return "";
    return sortDirection === "asc" ? " ↑" : " ↓";
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        padding: 10,
        marginTop: "64px",
        backgroundColor: "#ffffff",
        height: "calc(100vh - 64px)",
        overflowY: "auto",
        color: "#000000ff",
        borderTopLeftRadius: 12,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Starred
      </Typography>

      <MenuBar />

      <Box
        sx={{
          display: "flex",
          px: 2,
          py: 1,
          mt: 2,
          borderBottom: "1px solid #e0e0e0",
          fontWeight: 500,
          fontSize: 14,
          color: "#5f6368",
          cursor: "pointer",
        }}
      >
        <Box sx={{ flex: 4 }} onClick={() => handleSort("name")}>
          Name{renderSortIndicator("name")}
        </Box>

        <Box sx={{ flex: 3 }} onClick={() => handleSort("sharedBy")}>
          Shared by{renderSortIndicator("sharedBy")}
        </Box>

        <Box sx={{ flex: 2 }} onClick={() => handleSort("date")}>
          Date shared{renderSortIndicator("date")}
        </Box>

        <Box sx={{ width: 40 }} />
      </Box>

      {sortedFiles.map((file) => (
        <Box
          key={file.id}
          sx={{
            display: "flex",
            alignItems: "center",
            px: 2,
            py: 1.5,
            borderBottom: "1px solid #f1f3f4",
            "&:hover": { backgroundColor: "#f8f9fa" },
          }}
        >
          <Box sx={{ flex: 4, display: "flex", alignItems: "center", gap: 1.5 }}>
            {file.isStarred && <StarIcon sx={{ color: "#f7cb4d", fontSize: 20 }} />}

            <img src={file.icon} width={20} height={20} alt="file icon" />
            {file.name}
          </Box>

          <Box sx={{ flex: 3, color: "#5f6368" }}>{file.owner || "Unknown"}</Box>
          <Box sx={{ flex: 2, color: "#5f6368" }}>
            {file.lastAccessedAt || file.uploadedAt
              ? new Date(file.lastAccessedAt || file.uploadedAt).toLocaleDateString()
              : "—"}
          </Box>

          <IconButton onClick={handleOpenMenu}>
            <MoreVertIcon sx={{ color: "#5f6368" }} />
          </IconButton>
        </Box>
      ))}

      <Menu anchorEl={menuEl} open={Boolean(menuEl)} onClose={handleCloseMenu}>
        <MenuItem onClick={handleCloseMenu}>Open</MenuItem>
        <MenuItem onClick={handleCloseMenu}>Remove from Starred</MenuItem>
      </Menu>
    </Box>
  );
}

export default Starred;
