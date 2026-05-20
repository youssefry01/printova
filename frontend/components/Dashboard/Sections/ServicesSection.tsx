import { useState } from "react";
import Section from "../../ui/Section";
import FormGrid from "../../ui/FormGrid";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import ServiceResultBox from "../ResultBoxes/ServiceResultBox";
import useService from "@/hooks/useService";

type AddServiceForm = {
  name: string;
  price: string;
};

type UpdateServiceForm = {
  id: string;
  name: string;
  price: string;
};

const ServicesSection = () => {
  const { getAllServices, getServiceById, addService, updateService, removeService } = useService();

  // ---------- STATE ----------
  const [allServicesResult, setAllServicesResult] = useState<unknown | null>(null);

  const [serviceId, setServiceId] = useState("");
  const [serviceResult, setServiceResult] = useState<unknown | null>(null);

  const [addForm, setAddForm] = useState<AddServiceForm>({ name: "", price: "" });
  const [addResult, setAddResult] = useState<unknown | null>(null);

  const [updateForm, setUpdateForm] = useState<UpdateServiceForm>({ id: "", name: "", price: "" });
  const [updateResult, setUpdateResult] = useState<unknown | null>(null);

  const [deleteId, setDeleteId] = useState("");
  const [deleteResult, setDeleteResult] = useState<unknown | null>(null);

  // ---------- HANDLERS ----------
  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
  };

  const handleGetAll = async () => {
    const res = await getAllServices();
    setAllServicesResult(res);
  };

  const handleGetById = async () => {
    const res = await getServiceById(serviceId);
    setServiceResult(res);
  };

  const handleAdd = async () => {
    const res = await addService(addForm.name, addForm.price);
    setAddResult(res);
  };

  const handleUpdate = async () => {
    const res = await updateService( updateForm.id, updateForm.name, updateForm.price );
    setUpdateResult(res);
  };

  const handleDelete = async () => {
    const res = await removeService(deleteId);
    setDeleteResult(res);
  };

  return (
    <Section title="Services">

      {/* ===== GET ALL ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Get All Services</h3>

        <Button onClick={handleGetAll} className="mb-2">Get All Services</Button>

        <ServiceResultBox data={allServicesResult} />
      </div>

      {/* ===== GET BY ID ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Get Service</h3>

        <FormGrid>
          <Input placeholder="Service ID" value={serviceId} onChange={(e) => setServiceId(e.target.value)} />
        </FormGrid>

        <Button onClick={handleGetById} className="mb-2">Get Service</Button>

        <ServiceResultBox data={serviceResult} />
      </div>

      {/* ===== ADD ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Add Service</h3>
        <p className="text-sm text-gray-500 mb-2">
          Allowed Roles: Admin, Manager
        </p>

        <FormGrid>
          <Input name="name" placeholder="Service Name" value={addForm.name} onChange={handleAddChange} />
          <Input name="price" placeholder="Service Price" value={addForm.price} onChange={handleAddChange} />
        </FormGrid>

        <Button onClick={handleAdd} className="mb-2">Add Service</Button>

        <ServiceResultBox data={addResult} />
      </div>

      {/* ===== UPDATE ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Update Service</h3>
        <p className="text-sm text-gray-500 mb-2">Allowed Roles: Admin, Manager</p>

        <FormGrid>
          <Input name="id" placeholder="Service ID" value={updateForm.id} onChange={handleUpdateChange} />
          <Input name="name" placeholder="Service Name" value={updateForm.name} onChange={handleUpdateChange} />
          <Input name="price" placeholder="Service Price" value={updateForm.price} onChange={handleUpdateChange} />
        </FormGrid>

        <Button onClick={handleUpdate} className="mb-2">Update Service</Button>

        <ServiceResultBox data={updateResult} />
      </div>

      {/* ===== DELETE ===== */}
      <div>
        <h3 className="font-semibold text-lg mb-1">Delete Service</h3>
        <p className="text-sm text-gray-500 mb-2">Allowed Roles: Admin, Manager</p>

        <FormGrid>
          <Input placeholder="Service ID" value={deleteId} onChange={(e) => setDeleteId(e.target.value)} />
        </FormGrid>

        <Button onClick={handleDelete} variant="danger" className="mb-2">Delete Service</Button>

        <ServiceResultBox data={deleteResult} />
      </div>

    </Section>
  );
};

export default ServicesSection;