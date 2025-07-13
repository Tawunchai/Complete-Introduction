import React, { useEffect, useState } from "react";
import "./review.css";
import { listReviews } from "../../../service/index";
import type { ReviewInterface } from "../../../interface/IReview";

// ปรับให้ดาวเต็ม/ครึ่งใช้สี #f59e42 เช่นเดิม
function renderStars(score: number) {
  const full = Math.floor(score);
  const half = score % 1 >= 0.5;
  const arr = Array(full).fill('★').concat(half ? ['☆'] : []);
  return (
    <span className="star-text">
      {arr.map((v, i) => (
        <span key={i} style={{ color: "#f59e42", fontSize: "1.2em", marginRight: 1 }}>{v}</span>
      ))}
    </span>
  );
}

const PAGE_SIZE = 4;

const CustomerReviews: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewInterface[]>([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const res = await listReviews();
    if (res) setReviews(res);
  };

  const pageCount = Math.ceil(reviews.length / PAGE_SIZE);
  const showReviews = reviews.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const handlePrev = () => setPage((prev) => Math.max(0, prev - 1));
  const handleNext = () => setPage((prev) => Math.min(pageCount - 1, prev + 1));

  return (
    <div className="review-section">
      <div className="review-header-row">
        <h1 className="review-title">What Our Customers Say</h1>
        <div className="review-header-actions">
          <button className="review-viewall-btn">View all Review</button>
          <button className="review-add-btn">Add Review</button>
        </div>
      </div>
      <div className="review-grid">
        {showReviews.map((r, idx) => (
          <div className="review-card" key={r.ID || idx}>
            <div className="review-stars">
              {renderStars(r.Rating ?? 0)}
            </div>
            <div className="review-text">{r.Comment}</div>
            <div className="review-author">
              {r.User?.FirstName ? `${r.User.FirstName} ${r.User.LastName ?? ""}` : "Anonymous"}
            </div>
          </div>
        ))}
      </div>
      {pageCount > 1 && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 24, gap: 8 }}>
          <button onClick={handlePrev} disabled={page === 0} className="review-paging-btn">
            Prev
          </button>
          <span style={{ alignSelf: "center" }}>
            Page {page + 1} / {pageCount}
          </span>
          <button onClick={handleNext} disabled={page >= pageCount - 1} className="review-paging-btn">
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerReviews;
