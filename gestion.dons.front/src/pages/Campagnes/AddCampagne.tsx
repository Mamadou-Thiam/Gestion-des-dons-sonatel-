import {
  Button,
  Form,
  Input,
  Space,
  Row,
  Col,
  DatePicker,
  Select,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";

const AddCampagne: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [themes, setThemes] = useState([]);
  const [selectedThemeId, setSelectedThemeId] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(
          `https://wesaloapi-dsiwessalo-dev.apps.malaaw-rec.orange-sonatel.com/api/groupes`
        );
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const response = await axios.get(
          `https://wesaloapi-dsiwessalo-dev.apps.malaaw-rec.orange-sonatel.com/api/theme-campagnes`
        );
        setThemes(response.data);
      } catch (error) {
        console.error("Error fetching theme:", error);
      }
    };

    fetchTheme();
  }, []);

  const handleCancel = () => {
    // Réinitialiser les champs du formulaire
    form.resetFields();
  };

  const handleSaveCampagne = async () => {
    try {
      // Valider les champs du formulaire
      const values = await form.validateFields();
      const data = {
        libelle: values.libelle,
        reference: values.reference,
        description: values.description,
        banniere: values.banniere,
        dateDebut: values.dateDebut,
        dateFin: values.dateFin,
        montantCible: values.montantCible,
        montantActuel: values.montantActuel,
        nombreDon: values.nombreDon,
        montantKit: values.montantKit,
        montantDonFixe: values.montantDonFixe,
        groupe: { id: selectedGroupId },
        theme: { id: selectedThemeId },
      };

      // Envoyer la requête avec les données
      await axios.post(
        "https://wesaloapi-dsiwessalo-dev.apps.malaaw-rec.orange-sonatel.com/api/campagnes",
        data
      );

      navigate("/campagne");
      message.success("campagne ajouté avec succés!");
    } catch (error) {
      console.error("Validation Failed:", error);
      message.error("erreur lors de l'ajout du campagne");
    }
  };

  return (
    <>
    <h1>Formulaire d'ajout d'une campagne</h1>
    <Form
      style={{  marginTop: "70px",marginRight:"70px"  }}
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      layout="horizontal"
      initialValues={{ size: "large" }}
      size="large"
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Libellé"
            name="libelle"
            rules={[{ required: true, message: 'Veuillez saisir un libellé' }]}
          >
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Reference"
            name="reference"
            rules={[{ required: true, message: 'Veuillez saisir une référence' }]}
          >
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Montant Cible"
            name="montantCible"
            rules={[{ required: true, message: 'Veuillez saisir un montant cible' }]}
          >
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Montant Actuel"
            name="montantActuel"
            rules={[{ required: true, message: 'Veuillez saisir un montant actuel' }]}
          >
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Date de début"
            name="dateDebut"
            rules={[{ required: true, message: 'Veuillez sélectionner une date de début' }]}
          >
            <DatePicker style={{ borderRadius: 0, width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Date Fin"
            name="dateFin"
          
          >
            <DatePicker style={{ borderRadius: 0, width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Nombre de Don"
            name="nombreDon"
       >
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Montant-Don-Fixe"
            name="montantDonFixe"
            
          >
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Groupe"
            name="groupeId"
            
          >
            <Select
              style={{ width: "100%", borderRadius: "0px" }}
              options={groups.map((group) => ({
                value: group.id,
                label: group.libelle,
              }))}
              placeholder="Sélectionner un groupe"
              onChange={(value) => setSelectedGroupId(value)}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Theme"
            name="themeId"
          
          >
            <Select
              style={{ width: "100%", borderRadius: "0px" }}
              options={themes.map((theme) => ({
                value: theme.id,
                label: theme.libelle,
              }))}
              placeholder="Sélectionner un thème"
              onChange={(value) => setSelectedThemeId(value)}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Montant Kit"
            name="montantKit"
          
          >
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Banniere"
            name="banniere"
          >
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="end" style={{ marginRight: "400px", marginTop: "30px" }}>
        <Space>
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
          <Button
            style={{
              background: "black",
              color: "white",
              borderRadius: "0px",
            }}
            icon={<SaveOutlined />}
            size="large"
            onClick={handleSaveCampagne}
          >
            Enregistrer
          </Button>
        </Space>
      </Row>
    </Form></>
  );
};

export default AddCampagne;
