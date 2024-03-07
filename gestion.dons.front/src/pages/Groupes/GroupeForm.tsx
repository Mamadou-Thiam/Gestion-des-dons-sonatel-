import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Select } from "antd";
import axios from "axios";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import DataGroupe from "../../model/Groupe.model";
const { Option } = Select;

const GroupeForm: React.FC = () => {
  const [form] = Form.useForm();
  const { id } = useParams();

  const [groupe, setgroupe] = useState<DataGroupe>();

  const navigate = useNavigate();
  const handleCancel = () => {
    navigate("/groupe");
  };

  useEffect(() => {
    if (id) {
      axios
        .get(`/groupes/${id}`)
        .then((res) => {
          setgroupe({
            id: res.data.id,
            libelle: res.data.libelle,
            description: res.data.description,
            ninea: res.data.ninea,
            codeMarchand: res.data.codeMarchand,
            rccm: res.data.rccm,
            numeroTelephone: res.data.numeroTelephone,
            supprime: res.data.supprime,
            typeGroupe: res.data.typeGroupe,
            tag: res.data.tag,
            logo: res.data.logo,
          });
          form.setFieldsValue({
            id: res.data.id,
            libelle: res.data.libelle,
            description: res.data.description,
            ninea: res.data.ninea,
            codeMarchand: res.data.codeMarchand,
            rccm: res.data.rccm,
            numeroTelephone: res.data.numeroTelephone,
            tag: res.data.tag,
            logo: res.data.logo,
            typeGroupe: res.data.typeGroupe,
          });
        })
        .catch((err) => {
          console.log("Error from Update");
        });
    }
  }, [id, form]);

  const handleSaveGroupe = (values) => {
    const data = {
      id: groupe?.id,
      ...groupe,
      ...values,
    };

    const promise = groupe
      ? axios.put(`/groupes/${id}`, data)
      : axios.post("/groupes", data);

    promise
      .then((res) => {
        console.log(res);
        message.success("Groupe enregistré avec succès !");
        navigate("/groupe");
      })
      .catch((err) => {
        console.log(err);
        console.log("Error in Save!");
        message.error("Erreur lors de l'enregistrement du groupe.");
      });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold my-3">
        {groupe
          ? "Formulaire de modification    d'un groupe"
          : "Formulaire d'ajout d'un groupe"}
      </h1>

      <Form
        style={{ marginTop: "50px", marginLeft: "70px" }}
        form={form}
        layout="horizontal"
        size="large"
        className="custom-form"
        initialValues={groupe}
        onFinish={handleSaveGroupe}
      >
        <div className="grid grid-cols-2 gap-y-1 gap-x-32">
          <Form.Item
            label="Libellé"
            name="libelle"
            rules={[
              {
                required: true,
                message: "Veuillez renseigner le champ libelle",
              },
            ]}
          >
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea style={{ borderRadius: 0 }} />
          </Form.Item>

          <Form.Item label="Type de Groupe" name="typeGroupe">
            <Select
              showSearch
              placeholder="Sélectionner le type de Groupe"
              optionFilterProp="children"
            >
              <Option value="RSE">RSE</Option>
              <Option value="ASSOCIATION">ASSOCIATION</Option>

              <Option value="AUTRE">AUTRE</Option>
            </Select>
          </Form.Item>

          <Form.Item label="NINEA" name="ninea">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>

          <Form.Item label="Code Marchand" name="codeMarchand">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>

          <Form.Item label="RCCM" name="rccm">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>

          <Form.Item label="Numero Téléphone" name="numeroTelephone">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
          <Form.Item label="Tag" name="tag">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
          <Form.Item label="Logo" name="logo">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
        </div>

        <div
          style={{ display: "flex", marginLeft: "500px", marginTop: "20px" }}
        >
          <div>
            <Button
              style={{
                background: "#FF7900",
                color: "white",
                borderRadius: "0px",
              }}
              icon={<CloseOutlined />}
              size="large"
              onClick={handleCancel}
            >
              Annuler
            </Button>
          </div>
          <div style={{ margin: "0 10px" }}>
            <Button
              style={{
                background: "black",
                color: "white",
                borderRadius: "0px",
              }}
              htmlType="submit"
              icon={<SaveOutlined />}
              size="large"
            >
              Enregistrer
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default GroupeForm;
