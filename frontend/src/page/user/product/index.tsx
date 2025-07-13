import React, { useState } from "react";
import "./product.css";
import Reviews from "../review"
import MainImg from "../../../assets/phone.jpg";

const images = [
    MainImg,
    MainImg,
    MainImg,
    MainImg,
    MainImg,
];

const ProductDetail: React.FC = () => {
    const [mainImage, setMainImage] = useState(images[0]);
    const [quantity, setQuantity] = useState(1);

    return (
        <div className="product-detail-bg">
            <nav className="breadcrumb">
            </nav>
            <div className="product-detail-flex">
                {/* Main Product Image + Thumbnails */}
                <div className="main-image-column">
                    <div className="main-image-bg">
                        <img className="main-image-real" src={mainImage} alt="Product" />
                    </div>
                </div>
                {/* Content */}
                <div className="detail-content-col">
                    <div className="rating-row">
                        <span className="stars">★★★★☆</span>
                        <span className="rating-value">4.9/5</span>
                        <span className="review-count">550 Reviews</span>
                    </div>
                    <h1>
                        <span className="headline-bold">Digital Laser</span>{" "}
                        <span className="headline-light">Distance Meter</span>
                    </h1>
                    <div className="product-desc">
                        Measure distances with precision using this advanced digital laser distance meter. Ideal for construction sites, renovations, and interior projects, it delivers fast and accurate readings up to 100 meters.
                    </div>
                    <div className="product-price-row">
                        <div className="price">$45.99</div>
                        <div className="ontime-delivery">🚚 On Time Delivery</div>
                    </div>
                    <div className="cart-row">
                        <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                        <span className="qty">{quantity}</span>
                        <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
                        <button className="add-to-cart">
                            Add to cart <span style={{ marginLeft: 6 }}>🛒</span>
                        </button>
                        <button className="fav-btn" title="Add to favorites">
                            ♡
                        </button>
                    </div>
                </div>
            </div>
            <Reviews/>
        </div>
    );
};

export default ProductDetail;
