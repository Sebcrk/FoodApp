import React, { useState, useEffect, useCallback } from "react";
import classes from "./AvailableMeals.module.css";
import Card from "../UI/Card";
import MealItem from "./MealItem/MealItem";

const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getMeals = useCallback(async () => {
    try {
      const response = await fetch(
        "https://react-http-98ef4-default-rtdb.firebaseio.com/meals.json"
      );
      if (!response.ok) {
        console.log(response);
        throw new Error("Something went wrong!");
      }
      const responseData = await response.json();

      const loadedMeals = [];
      for (const key in responseData) {
        loadedMeals.push({
          id: key,
          name: responseData[key].name,
          description: responseData[key].description,
          price: +responseData[key].price,
        });
      }
      console.log(loadedMeals);
      setMeals(loadedMeals);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    getMeals();
  }, [getMeals]);

  if (error) {
    return (
      <section>
        <p className={classes.mealsError}>{error}</p>;
      </section>
    );
  }

  if (isLoading) {
    return (
      <section>
        <p className={classes.mealsLoading}>Loading...</p>;
      </section>
    );
  }

  const mealsList = meals.map((meal) => {
    return (
      <MealItem
        id={meal.id}
        key={meal.id}
        name={meal.name}
        description={meal.description}
        price={meal.price}
      />
    );
  });

  return (
    <section className={classes.meals}>
      <Card>{<ul>{mealsList}</ul>}</Card>
    </section>
  );
};

export default AvailableMeals;
