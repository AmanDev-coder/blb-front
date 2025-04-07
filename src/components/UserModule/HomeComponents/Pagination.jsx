import React from 'react';
import styled from 'styled-components';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const PageButton = styled.button`
  margin: 0 5px;
  padding: 10px 15px;
  border: none;
  background-color: hsl(210, 80%, 42%);
  color: white;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: hsl(210, 80%, 50%);
  }

  &:disabled {
    background-color: gray;
    cursor: not-allowed;
  }
`;

const Pagination = ({ currentPage, totalPages, paginate }) => {
  const handlePageChange = (pageNumber) => {
    paginate(pageNumber);
  };

  return (
    <PaginationContainer>
      <PageButton onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
        Previous
      </PageButton>
      {Array.from({ length: totalPages }, (_, index) => (
        <PageButton
          key={index + 1}
          onClick={() => handlePageChange(index + 1)}
          disabled={currentPage === index + 1}
        >
          {index + 1}
        </PageButton>
      ))}
      <PageButton onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
      </PageButton>
    </PaginationContainer>
  );
};

export default Pagination;