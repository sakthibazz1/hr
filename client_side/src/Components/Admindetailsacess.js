import React, { useState, useEffect } from "react";
import { Table, Container, Row, Col, Form, Button, Pagination } from "react-bootstrap";
import { getAdminPostbyStatus } from "../helper/Helper";
import { Link } from "react-router-dom";
import Loader from './Loader';


const Admindetailsacess = () => {
  const [allAdminPosts, setAllAdminPosts] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [ticketSearchTerm, setTicketSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true); 
  
  const postsPerPage = 10; // Number of results to display per page

  useEffect(() => {
    fetchAllUserDetails();
  }, []);

  const fetchAllUserDetails = async () => {
    try {
      const response = await getAdminPostbyStatus();
      const sortedResponse = response.sort((a, b) => b.Ticket_no - a.Ticket_no);
      setAllAdminPosts(sortedResponse);
      setSearchResult(sortedResponse);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching all user details:", error);
    }
  };

  const handleTicketSearch = () => {
    if (ticketSearchTerm === "") {
      setSearchResult(allAdminPosts);
    } else {
      const filteredResults = allAdminPosts.filter(
        user => user.Ticket_no.toString().includes(ticketSearchTerm)
      );
      setSearchResult(filteredResults);
    }
    setCurrentPage(1);
  };

  const handleSearchInputChange = event => {
    const searchTerm = event.target.value;
    setTicketSearchTerm(searchTerm);
    if (searchTerm === "") {
      setSearchResult(allAdminPosts);
    }
  };
  const handleFormSubmit = event => {
    event.preventDefault(); // Prevent the default form submission behavior
    handleTicketSearch(); // Call the existing search function
    setCurrentPage(1);
  };

  const paginate = pageNumber => {
    setCurrentPage(pageNumber);
  };
   
  
  const sortedSearchResult = Array.isArray(searchResult)
    ? [...searchResult].sort((a, b) => b.Ticket_no - a.Ticket_no)
    : [];

  const indexOfLastResult = currentPage * postsPerPage;
  const indexOfFirstResult = indexOfLastResult - postsPerPage;
  const resultsToDisplay = sortedSearchResult.slice(indexOfFirstResult, indexOfLastResult);

  const pageNumbers = Array.from({ length: Math.ceil(sortedSearchResult.length / postsPerPage) }, (_, i) => i + 1);

  if (isLoading) {
    return (
     <Loader/>
    );
  }

  return (
    <div className="pt-5">
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}> {/* Add custom div with max-width */}
      <Container fluid >
    
          <Row className="mt-3" >
            <Col md={12}>
            <Form onSubmit={handleFormSubmit}>
                <Form.Group controlId="searchTicketNumber">
                  <Form.Label><h6>Search by Ticket Number:</h6></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Ticket Number"
                    value={ticketSearchTerm}
                    onChange={handleSearchInputChange}
                    style={{ maxWidth: '200px', }} // Adjust the maxWidth value as needed
                  />
                </Form.Group>
            
                <Button variant="outline-info" onClick={handleTicketSearch} className="mt-2">
                  Search Ticket
                </Button>
           
              </Form>
            </Col>
          </Row>
      
        {resultsToDisplay.length > 0 ? (
          <Row className="mt-2">
            <Col md={12} style={{ marginLeft: '30px' }}>
              <h3>Aroha Technologies Client Requirement:</h3>
              <Table   style={{ width: '100%', border: 'none' }} striped hover >
                <thead>
                  <tr>
                  <th> Here To Start</th>
                    <th>Ticket No</th>
                    <th>Client_Name</th>
                    <th>Tech Stack</th>
                    <th>Location</th>
                    <th>Status</th>
                    
                    <th>Date</th>
                    
                  
                  </tr>
                </thead>
                <tbody>
                  {resultsToDisplay.map((user) => (
                    <tr key={user._id}>
                       <td>
                      <Link to={`/recutepost/${user._id}`}>
                            <Button variant="outline-dark" size="md">Post</Button>
                          </Link>
                      </td>
                      <td>{user.Ticket_no}</td>
                      <td>{user.Client_Name}</td>
                      <td>{user.Tech_stack}</td>
                      <td>{user.Location}</td>
                      <td>{user.status}</td>
                    
                      <td>{new Date(user.date).toLocaleDateString("en-GB")}</td>
                     
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col md={12}> 
              <p>No results found.</p>
            </Col>
          </Row>
        )}
         <Pagination style={{ marginTop: '10px', justifyContent: 'center' }}>
  {pageNumbers.map((number) => {
    if (Math.abs(number - currentPage) <= 2 || number === 1 || number === pageNumbers.length) {
      return (
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => paginate(number)}
          style={{
            backgroundColor: number === currentPage ? '#007bff' : 'white',
            color: number === currentPage ? 'white' : '#007bff',
            border: '1px solid #007bff',
            margin: '2px',
            cursor: 'pointer',
          }}
        >
          {number}
        </Pagination.Item>
      );
    } else if (Math.abs(number - currentPage) === 3) {
      return <Pagination.Ellipsis key={number + 'ellipsis'} disabled />;
    }
    return null;
  })}
</Pagination>
      </Container>
    </div>
  </div>
  );
};

export default Admindetailsacess;