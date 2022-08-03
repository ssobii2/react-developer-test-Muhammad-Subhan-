import React, { Component } from "react";
import { gql } from "@apollo/client";

export default class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {},
      prices: [],
      gallery: [],
      currentImage: "",
    };
  }

  getProduct = (id) => {
    this.props.client
      .query({
        query: gql`
          {
            product(id: "${id}") {
              id
              name
              inStock
              gallery
              description
              category
              attributes {
                id
                name
                type
                items {
                  displayValue
                  value
                  id
                }
              }
              prices {
                currency {
                  label
                  symbol
                }
                amount
              }
              brand
            }
          }
        `,
      })
      .then((result) => {
        this.setState({
          product: result.data.product,
          prices: result.data.product.prices,
          gallery: result.data.product.gallery,
          currentImage: result.data.product.gallery[0],
        });
      });
  };

  handleImageChange = (image) => {
    this.setState({
      ...this.state,
      currentImage: image,
    });
  };

  componentDidMount() {
    let id = window.location.pathname.slice(9, window.location.pathname.length);
    this.getProduct(id);
  }

  render() {
    return (
      <div className="products">
        <div className="sm-images">
          {this.state.gallery.map((image, index) => {
            return (
              <img
                key={index}
                src={image}
                alt="product"
                width="79px"
                height="80px"
                onClick={() => this.handleImageChange(image)}
              />
            );
          })}
        </div>
        <div className="content">
          <img
            className="big-img"
            src={this.state.currentImage}
            alt="product"
            width="450px"
            height="420px"
          />
          <div className="info">
            <h3>{this.state.product.name}</h3>
            <h4 className="margin">SIZE:</h4>
            <button className="size-btn">XS</button>
            <button className="size-btn">S</button>
            <button className="size-btn">M</button>
            <button className="size-btn">L</button>
            <h4 className="margin">COLOR:</h4>
            <div className="boxes">
              <div className="gray"></div>
              <div className="black"></div>
              <div className="green"></div>
            </div>
            <h4 className="margin">PRICE:</h4>
            {/* eslint-disable-next-line */}
            {this.state.prices.map((price, index) => {
              if (index === 0) {
                return (
                  <h3 key={index}>
                    {price.currency.symbol}
                    {price.amount}
                  </h3>
                );
              }
            })}
            <button className="cart-btn">ADD TO CART</button>
            <p className="margin">{this.state.product.description}</p>
          </div>
        </div>
      </div>
    );
  }
}
