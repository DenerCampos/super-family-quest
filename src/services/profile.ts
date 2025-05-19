import type { UserProfile } from "../contexts/AuthContext";

export const profile = async (): Promise<UserProfile> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    email: 'denerjcampos@gmail.com',
    name: 'Dener Campos',
    family: 'Campos',
    income: 5000,
    expenses: 2000,
    coins: 30,
    coatOfArms: '/assets/images/brasao.png',
  };
}