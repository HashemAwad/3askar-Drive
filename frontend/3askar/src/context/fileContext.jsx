import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

export const FileContext = createContext();

export const FileProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState("files");
  const [typeFilter, setTypeFilter] = useState(null);
  const [peopleFilter, setPeopleFilter] = useState(null);
  const [modifiedFilter, setModifiedFilter] = useState(null);
  const [sourceFilter, setSourceFilter] = useState(null);

  useEffect(() => {
    const mockFiles = [
      {
        id: 1,
        name: "AI Ethics Assignment.pdf",
        owner: "professor@aub.edu.lb",
        location: "My Drive",
        dateUploaded: "2025-11-05T00:00:00Z",
        lastAccessedAt: "2023-11-10T00:00:00Z",
        isStarred: true,
        isDeleted: false,
        icon: "https://www.gstatic.com/images/icons/material/system/2x/picture_as_pdf_black_24dp.png",
      },
      {
        id: 2,
        name: "Group Project Slides.pptx",
        owner: "teamleader@gmail.com",
        location: "Shared with me",
        dateUploaded: "2023-01-24T00:00:00Z",
        lastAccessedAt: "2025-11-08T00:00:00Z",
        isStarred: false,
        isDeleted: false,
        icon: "https://www.gstatic.com/images/icons/material/system/2x/slideshow_black_24dp.png",
      },
      {
        id: 3,
        name: "Research Data Sheet.xlsx",
        owner: "labassistant@aub.edu.lb",
        location: "My Drive",
        dateUploaded: "2025-10-05T00:00:00Z",
        lastAccessedAt: "2025-11-11T00:00:00Z",
        isStarred: true,
        isDeleted: false,
        icon: "https://www.gstatic.com/images/icons/material/system/2x/grid_on_black_24dp.png",
      },
      {
        id: 4,
        name: "Old Notes.txt",
        owner: "me",
        location: "My Drive",
        dateUploaded: "2022-05-15T00:00:00Z",
        lastAccessedAt: "2022-05-15T00:00:00Z",
        isStarred: false,
        isDeleted: true,
        icon: "https://www.gstatic.com/images/icons/material/system/2x/description_black_24dp.png",
      },
    ];

    setFiles(mockFiles);
    setLoading(false);
  }, []);

  const toggleStar = (id) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === id ? { ...file, isStarred: !file.isStarred } : file
      )
    );
  };

  const softDelete = (id) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === id ? { ...file, isDeleted: true } : file
      )
    );
  };

  const restore = (id) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === id ? { ...file, isDeleted: false } : file
      )
    );
  };

  const deleteForever = (id) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const updateLastAccessed = (id) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === id
          ? { ...file, lastAccessedAt: new Date().toISOString() }
          : file
      )
    );
  };

  const matchTypeFilter = useCallback((file, typeLabel) => {
    if (!typeLabel) return true;
    const filename = file.name?.toLowerCase() || "";
    const mime = file.type?.toLowerCase() || "";

    const hasExtension = (exts = []) =>
      exts.some((ext) => filename.endsWith(ext));

    switch (typeLabel) {
      case "PDFs":
        return mime.includes("pdf") || filename.endsWith(".pdf");
      case "Images":
        return (
          mime.startsWith("image/") ||
          hasExtension([".png", ".jpg", ".jpeg", ".bmp", ".gif", ".webp"])
        );
      case "Videos":
        return (
          mime.startsWith("video/") ||
          hasExtension([".mp4", ".mov", ".avi", ".mkv", ".webm"])
        );
      case "Audio":
        return (
          mime.startsWith("audio/") ||
          hasExtension([".mp3", ".wav", ".aac", ".flac", ".ogg"])
        );
      case "Documents":
        return (
          hasExtension([".doc", ".docx", ".txt", ".rtf"]) ||
          mime.includes("wordprocessing")
        );
      case "Spreadsheets":
        return (
          hasExtension([".xls", ".xlsx", ".csv"]) || mime.includes("spreadsheet")
        );
      case "Presentations":
        return (
          hasExtension([".ppt", ".pptx", ".key"]) ||
          mime.includes("presentation")
        );
      case "Folders":
        return (file.type || "").toLowerCase() === "folder";
      default:
        return true;
    }
  }, []);

  const filterByModified = useCallback(
    (list) => {
      if (!modifiedFilter) return list;
      const today = new Date();

      return list.filter((file) => {
        const date = new Date(
          file.lastAccessedAt || file.dateUploaded || file.uploadedAt
        );
        if (!date || Number.isNaN(date)) return false;

        switch (modifiedFilter) {
          case "today":
            return date.toDateString() === today.toDateString();
          case "week":
            return today - date <= 7 * 24 * 60 * 60 * 1000;
          case "month":
            return (
              date.getMonth() === today.getMonth() &&
              date.getFullYear() === today.getFullYear()
            );
          default:
            return true;
        }
      });
    },
    [modifiedFilter]
  );

  const matchesSource = useCallback((file, source) => {
    switch (source) {
      case "anywhere":
        return !file.isDeleted;
      case "myDrive":
        return (
          !file.isDeleted &&
          ((file.location || "").toLowerCase() === "my drive" ||
            !file.location)
        );
      case "shared":
        return (
          !file.isDeleted &&
          ((file.location || "").toLowerCase().includes("shared") ||
            (file.sharedWith?.length ?? 0) > 0)
        );
      case "starred":
        return file.isStarred && !file.isDeleted;
      case "trash":
        return !!file.isDeleted;
      default:
        return !file.isDeleted;
    }
  }, []);

  const filteredFiles = useMemo(() => {
    let list = [...files];

    if (filterMode === "files") {
      list = list.filter(
        (file) => (file.type || "").toLowerCase() !== "folder"
      );
    } else if (filterMode === "folders") {
      list = list.filter(
        (file) => (file.type || "").toLowerCase() === "folder"
      );
    }

    if (typeFilter) {
      list = list.filter((file) => matchTypeFilter(file, typeFilter));
    }

    if (peopleFilter === "owned") {
      list = list.filter(
        (file) => (file.owner || "").toLowerCase().includes("me")
      );
    } else if (peopleFilter === "sharedWithMe") {
      list = list.filter((file) =>
        (file.location || "").toLowerCase().includes("shared")
      );
    } else if (peopleFilter === "sharedByMe") {
      list = list.filter(
        (file) =>
          (file.owner || "").toLowerCase().includes("me") &&
          (file.sharedWith?.length ?? 0) > 0
      );
    }

    list = filterByModified(list);

    if (sourceFilter) {
      list = list.filter((file) => matchesSource(file, sourceFilter));
    }

    return list;
  }, [
    files,
    filterMode,
    typeFilter,
    peopleFilter,
    matchTypeFilter,
    filterByModified,
    sourceFilter,
    matchesSource,
  ]);

  const filterBySource = useCallback(
    (list, fallback = "anywhere") => {
      const activeSource = sourceFilter || fallback;
      if (!activeSource) return list;
      return list.filter((file) => matchesSource(file, activeSource));
    },
    [sourceFilter, matchesSource]
  );

  return (
    <FileContext.Provider
      value={{
        files,
        setFiles,
        loading,
        filteredFiles,
        filterMode,
        setFilterMode,
        typeFilter,
        setTypeFilter,
        peopleFilter,
        setPeopleFilter,
        modifiedFilter,
        setModifiedFilter,
        sourceFilter,
        setSourceFilter,
        filterBySource,
        toggleStar,
        softDelete,
        restore,
        deleteForever,
        updateLastAccessed,
        restoreFromBin: restore,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export const useFiles = () => useContext(FileContext);
