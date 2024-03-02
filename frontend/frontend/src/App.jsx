import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const recordsPerPage = 20;

  useEffect(() => {
    fetch("http://localhost:3000/customer")
      .then((res) => res.json())
      .then((result) => {
        setData(result.rows);
        setFilteredData(result.rows);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    // Filter data based on search term
    const filtered = data.filter((row) =>
      Object.values(row).some(
        (value) => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset current page when search term changes
  }, [data, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSort = (columnName) => {
    if (sortColumn === columnName) {
      // Toggle sort order if the same column is clicked again
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set sort column and default to ascending order
      setSortColumn(columnName);
      setSortOrder("asc");
    }
  };

  // Sort data based on the selected column and order
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortColumn && sortOrder) {
      const factor = sortOrder === "asc" ? 1 : -1;
      if (sortColumn === 'age' || sortColumn === 'sno') {
        // Numeric sorting for age and sno columns
        return factor * (a[sortColumn] - b[sortColumn]);
      } else {
        // Default sorting for other columns
        return factor * (a[sortColumn].localeCompare(b[sortColumn]));
      }
    }
    return 0;
  });

  // Calculate index of the first and last record of current page
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedData.slice(indexOfFirstRecord, indexOfLastRecord);

  return (
    <div className="container">
      <div className="term">
      <h2 id="name">Customers Information</h2>
      <input
        type="text"
        placeholder="Search With Name or Location"
        value={searchTerm}
        onChange={handleSearch}
      /> </div>
      <div className="sort">
        <label htmlFor="sort-select"><b>Sort by</b>:</label>
        <select
          id="sort-select"
          onChange={(e) => handleSort(e.target.value)}
          value={sortColumn}
        >
          <option value="">Select Column</option>
          <option value="sno">Sno</option>
          <option value="customer_name">Customer Name</option>
          <option value="age">Age</option>
          <option value="phone">Phone</option>
          <option value="location">Location</option>
          <option value="created_at">Date or Time</option>
        </select>
        <select id="order" onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th onClick={() => handleSort("sno")}>Sno</th>
            <th onClick={() => handleSort("customer_name")}>Customer Name</th>
            <th onClick={() => handleSort("age")}>Age</th>
            <th onClick={() => handleSort("phone")}>Phone</th>
            <th onClick={() => handleSort("location")}>Location</th>
            <th onClick={() => handleSort("created_at")}>Date</th>
            <th onClick={() => handleSort("created_at")}>Time</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((row, index) => (
            <tr key={index}>
              <td>{row.sno}</td>
              <td>{row.customer_name}</td>
              <td>{row.age}</td>
              <td>{row.phone}</td>
              <td>{row.location}</td>
              <td>{row.created_at.slice(0, 10)}</td>
              <td>{row.created_at.slice(11, 19)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        recordsPerPage={recordsPerPage}
        totalRecords={sortedData.length}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

const Pagination = ({ recordsPerPage, totalRecords, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  const handleClick = (pageNumber) => {
    onPageChange(pageNumber);
  };

  return (
    <div className="pagination">
      <button disabled={currentPage === 1} onClick={() => handleClick(currentPage - 1)}>
        Prev
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          className={currentPage === page ? "active" : ""}
          onClick={() => handleClick(page)}
        >
          {page}
        </button>
      ))}
      <button disabled={currentPage === totalPages} onClick={() => handleClick(currentPage + 1)}>
        Next
      </button>
    </div>
  );
};

export default App;
