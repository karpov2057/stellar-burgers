import { FC } from 'react';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../slices/stellarBurgerSlice';
import { useParams } from 'react-router-dom';
import { Preloader, IngredientDetailsUI } from '@ui';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const ingredientData = useSelector((state) =>
    selectIngredients(state).find((i) => i._id === id)
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
