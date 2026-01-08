import React, { createContext, useContext, useState, useEffect } from 'react';
import { Person, Department, Website, Application, MockData } from '../types/schema';
import { mockData } from '../lib/mockData';

interface DataContextType {
  people: Person[];
  departments: Department[];
  websites: Website[];
  applications: Application[];
  
  // People CRUD
  addPerson: (person: Omit<Person, 'id'>) => void;
  updatePerson: (id: number, person: Partial<Person>) => void;
  deletePerson: (id: number) => void;

  // Department CRUD
  addDepartment: (department: Omit<Department, 'id'>) => void;
  updateDepartment: (id: number, department: Partial<Department>) => void;
  deleteDepartment: (id: number) => void;

  // Website CRUD
  addWebsite: (website: Omit<Website, 'id'>) => void;
  updateWebsite: (id: number, website: Partial<Website>) => void;
  deleteWebsite: (id: number) => void;

  // Application CRUD
  addApplication: (application: Omit<Application, 'id'>) => void;
  updateApplication: (id: number, application: Partial<Application>) => void;
  deleteApplication: (id: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [people, setPeople] = useState<Person[]>(mockData.people);
  const [departments, setDepartments] = useState<Department[]>(mockData.departments);
  const [websites, setWebsites] = useState<Website[]>(mockData.websites);
  const [applications, setApplications] = useState<Application[]>(mockData.applications);

  // --- People CRUD ---
  const addPerson = (person: Omit<Person, 'id'>) => {
    const newId = Math.max(...people.map(p => p.id), 0) + 1;
    setPeople([...people, { ...person, id: newId }]);
  };

  const updatePerson = (id: number, updatedPerson: Partial<Person>) => {
    setPeople(people.map(p => (p.id === id ? { ...p, ...updatedPerson } : p)));
  };

  const deletePerson = (id: number) => {
    setPeople(people.filter(p => p.id !== id));
  };

  // --- Department CRUD ---
  const addDepartment = (department: Omit<Department, 'id'>) => {
    const newId = Math.max(...departments.map(d => d.id), 0) + 1;
    setDepartments([...departments, { ...department, id: newId }]);
  };

  const updateDepartment = (id: number, updatedDepartment: Partial<Department>) => {
    setDepartments(departments.map(d => (d.id === id ? { ...d, ...updatedDepartment } : d)));
  };

  const deleteDepartment = (id: number) => {
    setDepartments(departments.filter(d => d.id !== id));
  };

  // --- Website CRUD ---
  const addWebsite = (website: Omit<Website, 'id'>) => {
    const newId = Math.max(...websites.map(w => w.id), 0) + 1;
    setWebsites([...websites, { ...website, id: newId }]);
  };

  const updateWebsite = (id: number, updatedWebsite: Partial<Website>) => {
    setWebsites(websites.map(w => (w.id === id ? { ...w, ...updatedWebsite } : w)));
  };

  const deleteWebsite = (id: number) => {
    setWebsites(websites.filter(w => w.id !== id));
  };

  // --- Application CRUD ---
  const addApplication = (application: Omit<Application, 'id'>) => {
    const newId = Math.max(...applications.map(a => a.id), 0) + 1;
    setApplications([...applications, { ...application, id: newId }]);
  };

  const updateApplication = (id: number, updatedApplication: Partial<Application>) => {
    setApplications(applications.map(a => (a.id === id ? { ...a, ...updatedApplication } : a)));
  };

  const deleteApplication = (id: number) => {
    setApplications(applications.filter(a => a.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        people,
        departments,
        websites,
        applications,
        addPerson,
        updatePerson,
        deletePerson,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        addWebsite,
        updateWebsite,
        deleteWebsite,
        addApplication,
        updateApplication,
        deleteApplication,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
