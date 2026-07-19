import Button from "@mui/material/Button";
import CardMedia from '@mui/material/CardMedia';
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import MobileStepper from "@mui/material/MobileStepper";
import styles from './Carousel.module.css';
import { useEffect, useState } from "react";
import "../../Colours.css";

interface ImageCarouselProps {
    images: { src: string, alt: string }[];
}

const ImageCarousel = ({images}: ImageCarouselProps) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const preloaded = images.map((image) => {
      const img = new Image();
      img.src = image.src;
      return img;
    });

    return () => {
      preloaded.forEach((img) => {
        img.src = "";
      });
    };
  }, [images]);

  return (
    <div className={styles.container}>
      <CardMedia
        component="img"
        height="400"
        image={images[activeStep].src}
        alt={images[activeStep].alt}
        className={styles['card-media']}
        sx={{ objectFit: 'contain' }}
      />
      <br />
      <MobileStepper
        className={styles['stepper']}
        steps={images.length}
        position="static"
        activeStep={activeStep}
        nextButton={
        <Button
          size="small"
          onClick={() => setActiveStep((s) => s + 1)}
          disabled={activeStep === images.length - 1}
        >
          Next
          <KeyboardArrowRight />
        </Button>
        }
        backButton={
          <Button
            size="small"
            onClick={() => setActiveStep((s) => s - 1)}
            disabled={activeStep === 0}
          >
            <KeyboardArrowLeft />
            Back
          </Button>
        }
      />
    </div>
  );
};

export default ImageCarousel;