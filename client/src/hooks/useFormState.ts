import { useState } from "react";

export const useFormState = initialState => {
  const [formState, setFormState] = useState(initialState);

  const handleChange = (field: string) => (e: any) => {
    setFormState((prev: any) => ({ ...prev, [field]: e.target.value }));
  };

  return { formState, setFormState, handleChange };
};
