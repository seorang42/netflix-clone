import { Rating } from "@mui/material";

interface IRatingBar {
  score: number;
}

function RatingBar({ score }: IRatingBar) {
  return (
    <Rating
      name="half-rating-read-small"
      defaultValue={score}
      precision={0.1}
      size="small"
      readOnly
    />
  );
}

export default RatingBar;
