import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FaCircleUser } from "react-icons/fa6";
import { FaStar, FaRegStar } from "react-icons/fa";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from "prop-types";

// Styled Components
const ReviewContainer = styled.div`
  width: 100%;
  font-family: "Poppins", sans-serif;
  padding: 1rem 0;
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2.5rem;
`;

const RatingOverview = styled.div`
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border-radius: 16px;
  padding: 1.75rem 2.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.3);
  
  .rating-number {
    font-size: 3rem;
    font-weight: 700;
    line-height: 1;
  }
  
  .rating-text {
    display: flex;
    flex-direction: column;
    
    .stars {
      display: flex;
      margin-bottom: 0.5rem;
      
      svg {
        color: #fff;
        margin-right: 0.25rem;
        font-size: 1.25rem;
      }
    }
    
    .label {
      font-size: 1.125rem;
      font-weight: 500;
    }
    
    .count {
      font-size: 0.875rem;
      opacity: 0.9;
      margin-top: 0.25rem;
    }
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 1.5rem 2rem;
  }
`;

const ReviewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
`;

const ReviewCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #f1f5f9;
  
  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    transform: translateY(-4px);
  }
`;

const ReviewerDetails = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  
  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    margin-right: 1rem;
    background: linear-gradient(135deg, #38bdf8 0%, #0284c7 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 1.25rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 1rem;
    border: 2px solid #e0f2fe;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  .info {
    flex: 1;
    
    .name {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 0.25rem;
      font-size: 1rem;
    }
    
    .date {
      font-size: 0.875rem;
      color: #64748b;
    }
  }
`;

const StarRatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
  
  svg {
    color: #f59e0b;
  }
  
  .rating-score {
    margin-left: 0.5rem;
    font-weight: 600;
    color: #0f172a;
    font-size: 0.875rem;
  }
`;

const ReviewText = styled.div`
  font-size: 0.95rem;
  line-height: 1.7;
  color: #334155;
  margin-bottom: 0.75rem;
  
  &.expanded {
    white-space: pre-line;
  }
`;

const ShowMoreButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #3b82f6;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  margin-top: 0.5rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ShowButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: white;
  border: 1px solid #e2e8f0;
  color: #0f172a;
  font-weight: 600;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0 auto;
  
  &:hover {
    background-color: #f8fafc;
    border-color: #cbd5e1;
  }
  
  .icon {
    transition: transform 0.2s ease;
  }
  
  &:hover .icon {
    transform: translateX(3px);
  }
`;

const EmptyReviews = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
  border-radius: 12px;
  
  h3 {
    margin: 1rem 0 0.5rem;
    font-size: 1.25rem;
    font-weight: 600;
    color: #0f172a;
  }
  
  p {
    color: #64748b;
    max-width: 400px;
    margin: 0 auto;
  }
  
  svg {
    color: #3b82f6;
  }
`;

const ModalContent = styled.div`
  .review-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
`;

// Star Rating Component
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <StarRatingContainer>
      {[...Array(5)].map((_, i) => (
        <FaStar 
          key={i} 
          color={i < fullStars ? "#f59e0b" : (i === fullStars && hasHalfStar ? "#f59e0b" : "#e2e8f0")} 
        />
      ))}
      <span className="rating-score">{rating.toFixed(1)}</span>
    </StarRatingContainer>
  );
};

// Add PropTypes validation for StarRating
StarRating.propTypes = {
  rating: PropTypes.number.isRequired
};

const YachtReview = ({ yachtId }) => {
  const [expandedReviews, setExpandedReviews] = useState({});
  const [reviewsData, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Toggle Read More / Read Less
  const toggleReadMore = (index) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Fetch Reviews on Component Mount
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/reviews/?yachtId=${yachtId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        console.log("Fetched Reviews:", data);
        setReviews(data.data.reviews || []);
        setError(null);

      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError("Failed to load reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [yachtId]);

  // Calculate average rating
  const averageRating = reviewsData.length > 0
    ? (reviewsData.reduce((sum, review) => sum + (review.rating || 4.5), 0) / reviewsData.length).toFixed(1)
    : "0.0";

  if (loading) {
    return (
      <ReviewContainer>
        <ReviewHeader>
          <RatingOverview>
            <div className="rating-number">...</div>
            <div className="rating-text">
              <div className="label">Loading reviews</div>
            </div>
          </RatingOverview>
        </ReviewHeader>
      </ReviewContainer>
    );
  }

  if (error) {
    return (
      <EmptyReviews>
        <FaStar size={40} />
        <h3>Couldn't load reviews</h3>
        <p>{error}</p>
      </EmptyReviews>
    );
  }

  return (
    <ReviewContainer>
      <ReviewHeader>
        <RatingOverview>
          <div className="rating-number">{averageRating}</div>
          <div className="rating-text">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
            <div className="label">
              {parseFloat(averageRating) >= 4.5 ? "Excellent" : 
               parseFloat(averageRating) >= 4.0 ? "Very Good" : 
               parseFloat(averageRating) >= 3.0 ? "Good" : "Average"}
            </div>
            <div className="count">
              {reviewsData.length} {reviewsData.length === 1 ? "review" : "reviews"}
            </div>
          </div>
        </RatingOverview>
      </ReviewHeader>

      {reviewsData.length > 0 ? (
        <>
          <ReviewsGrid>
            {reviewsData.slice(0, 6).map((review, index) => {
              const isExpanded = expandedReviews[index];
              const shortText = review.comment?.substring(0, 100) || "";
              const fullText = review.comment || "";
              const needsExpansion = fullText.length > 100;
              
              const reviewDate = new Date(review.date).toLocaleString(
                "en-US",
                {
                  month: "long",
                  year: "numeric",
                }
              );
              
              return (
                <ReviewCard 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ReviewerDetails>
                    {review?.profilePicture ? (
                      <img
                        src={review.profilePicture}
                        alt={review.userName || "Anonymous"}
                      />
                    ) : (
                      <div className="avatar">
                        {review.userName
                          ? review.userName.charAt(0).toUpperCase()
                          : "U"}
                      </div>
                    )}
                    
                    <div className="info">
                      <div className="name">
                        {review.userName
                          ? review.userName.charAt(0).toUpperCase() +
                            review.userName.slice(1)
                          : "Unknown"}
                      </div>
                      <div className="date">{reviewDate}</div>
                    </div>
                  </ReviewerDetails>
                  
                  <StarRating rating={review.rating || 4.5} />
                  
                  <ReviewText className={isExpanded ? 'expanded' : ''}>
                    {needsExpansion 
                      ? (isExpanded ? fullText : `${shortText}... `) 
                      : fullText}
                    
                    {needsExpansion && (
                      <ShowMoreButton onClick={() => toggleReadMore(index)}>
                        {isExpanded ? "Show less" : "Show more"}
                      </ShowMoreButton>
                    )}
                  </ReviewText>
                </ReviewCard>
              );
            })}
          </ReviewsGrid>
          
          {reviewsData.length > 6 && (
            <ShowButton 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleOpenModal}
            >
              Show all {reviewsData.length} reviews
              <ArrowForwardIosIcon className="icon" style={{ fontSize: "16px" }} />
            </ShowButton>
          )}
          
          {/* All Reviews Modal */}
          <Dialog
            open={modalOpen}
            onClose={handleCloseModal}
            maxWidth="md"
            fullWidth
            aria-labelledby="all-reviews-title"
            PaperProps={{
              style: {
                borderRadius: '12px',
                overflow: 'hidden'
              }
            }}
          >
            <DialogTitle id="all-reviews-title" sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
              padding: '16px 24px'
            }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: '1.125rem' }}>All Reviews</span>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px' }}>
                  {reviewsData.length} verified guest reviews
                </div>
              </div>
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleCloseModal}
                aria-label="close"
                sx={{ color: '#64748b' }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ padding: '24px' }}>
              <ModalContent>
                <div className="review-list">
                  {reviewsData.map((review, index) => {
                    const reviewDate = new Date(review.date).toLocaleDateString(
                      "en-US",
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }
                    );
                    
                    return (
                      <ReviewCard key={index}>
                        <ReviewerDetails>
                          {review?.profilePicture ? (
                            <img
                              src={review.profilePicture}
                              alt={review.userName || "Anonymous"}
                            />
                          ) : (
                            <div className="avatar">
                              {review.userName
                                ? review.userName.charAt(0).toUpperCase()
                                : "U"}
                            </div>
                          )}
                          
                          <div className="info">
                            <div className="name">
                              {review.userName
                                ? review.userName.charAt(0).toUpperCase() +
                                  review.userName.slice(1)
                                : "Unknown"}
                            </div>
                            <div className="date">{reviewDate}</div>
                          </div>
                        </ReviewerDetails>
                        
                        <StarRating rating={review.rating || 4.5} />
                        
                        <ReviewText>{review.comment}</ReviewText>
                      </ReviewCard>
                    );
                  })}
                </div>
              </ModalContent>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <EmptyReviews>
          <FaStar size={40} />
          <h3>No reviews yet</h3>
          <p>This yacht doesn't have any reviews yet. Be the first to share your experience!</p>
        </EmptyReviews>
      )}
    </ReviewContainer>
  );
};

// Add PropTypes validation for YachtReview
YachtReview.propTypes = {
  yachtId: PropTypes.string.isRequired
};

export default YachtReview;