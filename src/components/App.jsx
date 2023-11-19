import React, { Component } from 'react';
import axios from 'axios';
import { Button } from './Button'; 
import { Modal } from './Modal'; 
import { Searchbar } from './Searchbar'; 
import { ImageGallery } from './ImageGallery'; 
import { ImageGalleryItem } from './ImageGalleryItem';
import { Bars } from 'react-loader-spinner';
import styled from 'styled-components';

const StyledApp = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 16px;
  padding-bottom: 24px;
`;

export class App extends Component {
  state = {
    query: '',
    images: [],
    currentPage: 1,
    isLoading: false,
    selectedImage: null,
    totalHits: null,
  };

  async componentDidMount() {
    this.setState({ isLoading: true });
    try {
      const initialImages = await this.fetchImages();
      this.setState({
        images: initialImages,
      });
    } catch (error) {
      console.error('Error fetching initial images:', error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { query, currentPage } = this.state;

    if (prevState.query !== query || prevState.currentPage !== currentPage) {
      this.fetchImages();
    }
  }

  fetchImages = async () => {
    const { query, currentPage } = this.state;
    const apiKey = '40677979-cd292d53039c37b7a3f8f64ae';

    try {
      this.setState({ isLoading: true });

      const response = await axios.get(`https://pixabay.com/api/`, {
        params: { key: apiKey, q: query, page: currentPage, per_page: 12 },
      });

      const newImages = response.data.hits;
      const totalMaxHits = response.data.totalHits
      this.setState((prevState) => ({
        images: [...prevState.images, ...newImages],
        totalHits: totalMaxHits,
      }));
      return newImages; 
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleSearch = (newQuery) => {
    this.setState({ query: newQuery, images: [], currentPage: 1 });
  };

  loadMore = () => {
    this.setState((prevState) => ({ currentPage: prevState.currentPage + 1 }));
  };

openModal = (image) => {
  if (!this.state.isModalOpen) {
    this.setState({ selectedImage: image, isModalOpen: true });
    document.addEventListener('keydown', this.handleKeyDown);
  }
};

closeModal = () => {
  if (this.state.isModalOpen) {
    this.setState({ selectedImage: null, isModalOpen: false });
    document.removeEventListener('keydown', this.handleKeyDown);
  }
};

  handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      this.closeModal();
    }
  };

  render() {
    const { images, isLoading, selectedImage } = this.state;

    return (
      <StyledApp className="App">
        <Searchbar onSubmit={this.handleSearch} />
        <ImageGallery images={images} onImageClick={this.openModal}>
          {images.map((image) => (
            <ImageGalleryItem key={image.id} id={image.id} src={image.webformatURL} alt={image.tags} onClick={() => this.openModal(image)} />
          ))}
        </ImageGallery>
        {isLoading && <Bars type="Oval" color="#00BFFF" height={100} width={100} timeout={3000} />}
        {images.length > 0 && !isLoading && this.state.totalHits > images.length && <Button onLoadMore={this.loadMore} show={true} />}
        {selectedImage && (
          <Modal
            image={selectedImage.largeImageURL}
            onClose={this.closeModal}
          />
        )}
      </StyledApp>
    );
  }
}