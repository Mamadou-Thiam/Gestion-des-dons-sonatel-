import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Select } from "antd";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import GroupeService from "../../services/GroupeService";

const { Option } = Select;

const GroupeForm = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [groupe, setGroupe] = useState(null);
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/groupe");
  };

  useEffect(() => {
    if (id) {
      GroupeService.getGroupeById(id)
        .then((res) => {
          setGroupe(res);
          form.setFieldsValue(res);
        })
        .catch((err) => {
          console.log("Erreur lors de la récupération du groupe:", err);
        });
    }
  }, [id, form]);

  const handleSaveGroupe = async (values) => {
    try {
      const data = {
        id: groupe?.id,
        ...groupe,
        ...values,
      };

      let savedGroupe;
      if (groupe) {
        savedGroupe = await GroupeService.updateGroupe(id, data);
      } else {
        savedGroupe = await GroupeService.createGroupe(data);
      }

      message.success("groupe enregistré avec succès !");
      navigate("/groupe");
    } catch (error) {
      console.log("Erreur lors de l'enregistrement du groupe:", error);
      message.error("Erreur lors de l'enregistrement du groupe.");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold my-3">
        {groupe
          ? "Formulaire de modification d'un groupe"
          : "Formulaire d'ajout d'un groupe"}
      </h1>

      <Form
        style={{ marginTop: "50px" }}
        form={form}
        autoComplete="off"

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

          <Form.Item label="Ninea" name="ninea">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>

          <Form.Item label="Code Marchand" name="codeMarchand">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>

          <Form.Item label="Rccm" name="rccm">
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

        <div className="flex justify-end mt-4">
          <div>
            <Button
              className="white-button"
              onClick={handleCancel}
              style={{borderRadius:"0px"}}
            >
              <span className="mr-2">
                <CloseOutlined />
              </span>
              Annuler
            </Button>
          </div>
          <div>
            <Button
              style={{ margin: "0 10px" ,borderRadius:"0px"}}
              className="button-orange"
              htmlType="submit"

            >
              <span className="mr-2">
                <SaveOutlined />
              </span>
              Enregistrer
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default GroupeForm;
