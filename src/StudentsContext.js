import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'students';

const StudentsContext = createContext(null);

async function persist(list) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function StudentsProvider({ children }) {
  const [students, setStudents] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        setStudents(Array.isArray(parsed) ? parsed : []);
      } catch {
        setStudents([]);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // Writes to AsyncStorage first, then updates state, so a failed write is never shown as saved.
  const commit = useCallback(async (next) => {
    await persist(next);
    setStudents(next);
  }, []);

  const addStudent = useCallback(
    (data) => commit([...students, { ...data, id: String(Date.now()) }]),
    [students, commit]
  );

  const updateStudent = useCallback(
    (id, data) => commit(students.map((s) => (s.id === id ? { ...s, ...data, id } : s))),
    [students, commit]
  );

  const deleteStudent = useCallback(
    (id) => commit(students.filter((s) => s.id !== id)),
    [students, commit]
  );

  return (
    <StudentsContext.Provider
      value={{ students, loaded, addStudent, updateStudent, deleteStudent }}
    >
      {children}
    </StudentsContext.Provider>
  );
}

export function useStudents() {
  return useContext(StudentsContext);
}
