import React, { useState } from "react";
import { FaSearch, FaSort, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import styles from "./ProjectsTable.module.scss";

const initialProjects = [
  { id: "#P101", name: "Marina Expansion", client: "John Smith", budget: "$120,000", status: "Ongoing" },
  { id: "#P102", name: "Luxury Yacht Refurbishment", client: "Olivia Carter", budget: "$85,000", status: "Completed" },
  { id: "#P103", name: "Docking System Upgrade", client: "Michael Johnson", budget: "$150,000", status: "On Hold" },
  { id: "#P104", name: "Yacht Club Renovation", client: "Sophia Wilson", budget: "$220,000", status: "Ongoing" },
  { id: "#P105", name: "Water Sports Equipment Setup", client: "David Brown", budget: "$45,000", status: "Cancelled" },
];

const ProjectsTable = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = () => {
    const sortedProjects = [...projects].sort((a, b) => {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });
    setProjects(sortedProjects);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.projectsTable}>
      {/* 📌 Header & Controls */}
      <div className={styles.tableHeader}>
        <h3>📋 Projects Overview</h3>
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <button className={styles.sortBtn} onClick={handleSort}>
            <FaSort /> Sort
          </button>
          <button className={styles.addBtn}>
            <FaPlus /> Add New
          </button>
        </div>
      </div>

      {/* 📌 Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Project ID</th>
              <th>Project Name</th>
              <th>Client</th>
              <th>Budget</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr key={project.id}>
                <td>{project.id}</td>
                <td>{project.name}</td>
                <td>{project.client}</td>
                <td>{project.budget}</td>
                <td className={styles[project.status.toLowerCase().replace(" ", "-")]}>
                  {project.status}
                </td>
                <td className={styles.actions}>
                  <FaEdit className={styles.editIcon} />
                  <FaTrash className={styles.deleteIcon} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectsTable;
