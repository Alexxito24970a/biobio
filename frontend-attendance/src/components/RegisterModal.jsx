import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function RegisterModal({ show, handleClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario enviado:", form);
    // Podés hacer la lógica de registro acá
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Body className="d-flex p-0" style={{ borderRadius: "2rem", overflow: "hidden" }}>
        <div className="w-75 p-5">
          <h2 className="mb-3">Sign Up</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Password"
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100">Sign Up</Button>
          </Form>
        </div>
        <div className="w-25 bg-warning d-flex flex-column justify-content-center align-items-center text-white text-center p-4">
          <h3>Welcome Back!</h3>
          <p>Accede con tus credenciales</p>
          <Button variant="light" size="sm" onClick={handleClose}>Login</Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
