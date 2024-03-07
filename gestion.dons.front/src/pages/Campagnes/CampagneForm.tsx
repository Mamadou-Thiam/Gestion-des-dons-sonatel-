import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Select } from "antd";
import axios from "axios";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import { DataCampagne } from "../../model/Campagne.model";
const { Option } = Select;

const CampagneForm: React.FC = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [themes, setThemes] = useState([]);
  const [selectedThemeId, setSelectedThemeId] = useState(null);

  const [campagne, setCampagne] = useState<DataCampagne>({
    id: "",
    libelle: "",
    reference: "",
    description: "",
    dateDebut: "",
    dateFin: "",
    montantCible: "",
    montantActuel: "",
    montantKit: "",
    montantDonFixe: "",
    nombreDon: "",
    banniere: "",
    groupe: { id: selectedGroupId },
    theme: { id: selectedThemeId },
    supprime: false,
  });

  const navigate = useNavigate();
  const handleCancel = () => {
    navigate("/campagne");
  };

  useEffect(() => {
    // Fetch groups
    axios
      .get(`/groupes`)
      .then((res) => {
        setGroups(res.data);
      })
      .catch((err) => {
        console.log("Error fetching groups", err);
      });

    // Fetch themes
    axios
      .get(`/theme-campagnes`)
      .then((res) => {
        setThemes(res.data);
      })
      .catch((err) => {
        console.log("Error fetching themes", err);
      });

    if (id) {
      axios
        .get(`/campagnes/${id}`)
        .then((res) => {
          setCampagne(res.data);
          form.setFieldsValue(res.data);
        })
        .catch((err) => {
          console.log("Error from Update");
        });
    }
  }, [id, form]);

  const handleSaveGroupe = async (values) => {
    const data = {
      id: campagne?.id,
      ...campagne,
      ...values,
    };

    const promise = campagne
      ? axios.put(`/campagnes/${id}`, data)
      : axios.post("/campagnes", data);

    promise
      .then((res) => {
        message.success("Campagne enregistrée avec succès !");
        navigate("/campagne");
      })
      .catch((err) => {
        console.log(err);
        console.log("Error in Save!");
        message.error("Erreur lors de l'enregistrement de la campagne.");
      });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold my-3">
        {campagne.id
          ? "Formulaire de modification d'une campagne"
          : "Formulaire d'ajout d'une campagne"}
      </h1>

      <Form
        style={{ marginTop: "50px", marginLeft: "70px" }}
        form={form}
        layout="horizontal"
        size="large"
        className="custom-form"
        initialValues={campagne}
        onFinish={handleSaveGroupe}
      >
        <div className="grid grid-cols-2 gap-y-1 gap-x-32">
          <Form.Item
            label="Libellé"
            name="libelle"
            rules={[
              {
                required: true,
                message: "Veuillez renseigner le champ libellé",
              },
            ]}
          >
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea style={{ borderRadius: 0 }} />
          </Form.Item>

          <Form.Item label="Référence" name="reference">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>

          <Form.Item label="Date de début" name="dateDebut">
            <Input type="date" style={{ borderRadius: 0 }} />
          </Form.Item>

          <Form.Item label="Date de fin" name="dateFin">
            <Input type="date" style={{ borderRadius: 0 }} />
          </Form.Item>

          <Form.Item label="Montant cible" name="montantCible">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>

          <Form.Item label="Montant actuel" name="montantActuel">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>

          <Form.Item label="Montant kit" name="montantKit">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>

          <Form.Item label="Montant don fixe" name="montantDonFixe">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>

          <Form.Item label="Nombre don" name="nombreDon">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>

          <Form.Item label="Bannière" name="banniere">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>

          <Form.Item label="Groupe" name="groupeId">
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
          <Form.Item label="Theme" name="themeId">
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

export default CampagneForm;
