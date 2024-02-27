import { Button, Form, Input, Flex, message, Select } from "antd";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
const { Option } = Select;

type SizeType = Parameters<typeof Form>[0]["size"];

const AddGroupe: React.FC = () => {
  const [size] = useState<SizeType>("large");

  const [libelle, setLibelle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [ninea, setNinea] = useState<string>("");
  const [codeMarchand, setCodeMarchand] = useState<string>("");
  const [rccm, setRccm] = useState<string>("");
  const [numeroTelephone, setNumeroTelephone] = useState<string>("");
  const [typeGroupe, setTypeGroupe] = useState<string>("");

  const [form] = Form.useForm();

  const navigate = useNavigate();

  const handleCancel = () => {
    setLibelle("");
    setDescription("");
    setNinea("");
    setCodeMarchand("");
    setRccm("");
    setNumeroTelephone("");
    setTypeGroupe("");
  };

  const handleSaveGroupe = () => {
    form
      .validateFields()
      .then(() => {
        const data = {
          libelle,
          description,
          ninea,
          codeMarchand,
          rccm,
          numeroTelephone,
          typeGroupe,
        };

        axios
          .post(
            "https://wesaloapi-dsiwessalo-dev.apps.malaaw-rec.orange-sonatel.com/api/groupes",
            data
          )
          .then(() => {
            console.log("Save successful");
            message.success("groupe ajouté avec succès.");
            navigate("/groupe");
          })
          .catch((err) => {
            console.error("Error:", err);
          });
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
        message.error("error lors de l'ajout d'un groupe.");
      });
  };

  const handleTypeGroupeChange = (value: string) => {
    setTypeGroupe(value);
  };

  return (
   <>
   <h1>Formulaire d'ajout d'un groupe</h1>
    <Form
      style={{ marginTop: "50px" }}
      form={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      initialValues={{ size: "large" }}
      size="large"
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}>
        <div>
          <Form.Item
            label="libelle"
            name="libelle"
            rules={[
              {
                required: true,
                message: "Veuillez renseigner le champ libelle",
              },
            ]}
          >
            <Input
              style={{ borderRadius: 0 }}
              value={libelle}
              onChange={(e) => setLibelle(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Ninea">
            <Input
              style={{ borderRadius: 0 }}
              value={ninea}
              onChange={(e) => setNinea(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Rccm">
            <Input
              style={{ borderRadius: 0 }}
              value={rccm}
              onChange={(e) => setRccm(e.target.value)}
            />
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Description">
            <Input
              style={{ borderRadius: 0 }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Code-Marchand">
            <Input
              style={{ borderRadius: 0 }}
              value={codeMarchand}
              onChange={(e) => setCodeMarchand(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Numero-Telephone">
            <Input
              style={{ borderRadius: 0 }}
              value={numeroTelephone}
              onChange={(e) => setNumeroTelephone(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Type Groupe" name="typeGroupe">
            <Select
              showSearch
              placeholder="Sélectionner le type de groupe"
              optionFilterProp="children"
              onChange={handleTypeGroupeChange}
            >
              <Option value="RSE">RSE</Option>
              <Option value="ASSOCIATION">ASSOCIATION</Option>
              <Option value="AUTRE">AUTRE</Option>
            </Select>
          </Form.Item>
        </div>
      </div>

      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <div>
          <Flex gap="large" wrap="wrap">
            <Button
              style={{
                background: "#FF7900",
                color: "white",
                borderRadius: "0px",
              }}
              icon={<CloseOutlined />}
              size={size}
              onClick={handleCancel}
              href="/groupe"
            >
              Annuler
            </Button>
          </Flex>
        </div>
        <div style={{ margin: "0 10px" }}>
          <Flex gap="large" wrap="wrap">
            <Button
              style={{
                background: "black",

                color: "white",
                borderRadius: "0px",
              }}
              icon={<SaveOutlined />}
              size={size}
              onClick={handleSaveGroupe}
              // href="/groupe"
            >
              Enregistrer
            </Button>
          </Flex>
        </div>
      </div>
    </Form>
   </>
  );
};

export default AddGroupe;
