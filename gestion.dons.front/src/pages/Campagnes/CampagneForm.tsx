import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, message, Select } from "antd";
import axios from "axios";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import { DataCampagne } from "../../model/Campagne.model";

const CampagneForm: React.FC = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedGroupLabel, setSelectedGroupLabel] = useState<string | null>(
    null
  ); // New state for group label
  const [themes, setThemes] = useState([]);
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  const [selectedThemeLabel, setSelectedThemeLabel] = useState<string | null>(
    null
  ); // New state for theme label
  const [campagne, setCampagne] = useState<DataCampagne | null>(null);

  const navigate = useNavigate();
  const handleCancel = () => {
    navigate("/campagne");
  };

  useEffect(() => {
    // Fetch groups
    axios
      .get(`/groupes/all?supprime.equals=false`)
      .then((res) => {
        setGroups(res.data);
      })
      .catch((err) => {
        console.log("Error fetching groups", err);
      });

    // Fetch themes
    axios
      .get(`/theme-campagnes/all?supprime.equals=false`)
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
          setSelectedGroupId(res.data.groupe.id);
          setSelectedGroupLabel(res.data.groupe.libelle); // Set group label
          setSelectedThemeId(res.data.theme.id);
          setSelectedThemeLabel(res.data.theme.libelle); // Set theme label
        })
        .catch((err) => {
          console.log("Error fetching campaign data", err);
        });
    }
  }, [id, form]);

  const handleSaveCampagne = async (values) => {
    const data = {
      ...campagne,
      ...values,
      groupe: { id: selectedGroupId },
      theme: { id: selectedThemeId },
      nombreDon: campagne?.nombreDon || 0,
      reference: campagne?.reference || "ref",
    };

    const promise = campagne?.id
      ? axios.put(`/campagnes/${campagne.id}`, data)
      : axios.post("/campagnes", data);

    promise
      .then((res) => {
        message.success("Campagne enregistrée avec succès !");
        navigate("/campagne");
      })
      .catch((err) => {
        console.log("Error in Save!", err);
        message.error("Erreur lors de l'enregistrement de la campagne.");
      });
  };

  const handleGroupChange = (value) => {
    setSelectedGroupId(value);
    const selectedGroup = groups.find((group) => group.id === value);
    if (selectedGroup) {
      setSelectedGroupLabel(selectedGroup.libelle);
    }
  };

  const handleThemeChange = (value) => {
    setSelectedThemeId(value);
    const selectedTheme = themes.find((theme) => theme.id === value);
    if (selectedTheme) {
      setSelectedThemeLabel(selectedTheme.libelle);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold my-3">
        {campagne?.id
          ? "Formulaire de modification d'une campagne"
          : "Formulaire d'ajout d'une campagne"}
      </h1>

      <Form
        style={{ marginTop: "50px" }}
        form={form}
        autoComplete="off"
        layout="horizontal"
        size="large"
        className="custom-form"
        initialValues={campagne || {}}
        onFinish={handleSaveCampagne}
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

          <Form.Item label="Date de début" name="dateDebut">
            <Input type="date" style={{ borderRadius: 0 }} />
          </Form.Item>

          <Form.Item label="Date de fin" name="dateFin">
            <Input type="date" style={{ borderRadius: 0 }} />
          </Form.Item>

          <Form.Item label="Montant cible" name="montantCible">
            <Input type="Number" style={{ borderRadius: 0 }} />
          </Form.Item>

          <Form.Item label="Montant actuel" name="montantActuel">
            <Input type="Number" style={{ borderRadius: 0 }} />
          </Form.Item>

          <Form.Item label="Montant kit" name="montantKit">
            <Input type="Number" style={{ borderRadius: 0 }} />
          </Form.Item>

          <Form.Item label="Montant don fixe" name="montantDonFixe">
            <Input type="Number" style={{ borderRadius: 0 }} />
          </Form.Item>

          <Form.Item label="Nombre don" name="nombreDon">
            <Input type="number" style={{ borderRadius: 0 }} readOnly />
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
              onChange={handleGroupChange}
            />
          </Form.Item>

          <Form.Item label="Thème" name="themeId">
            <Select
              style={{ width: "100%", borderRadius: "0px" }}
              options={themes.map((theme) => ({
                value: theme.id,
                label: theme.libelle,
              }))}
              placeholder="Sélectionner un thème"
              onChange={handleThemeChange}
            />
          </Form.Item>
        </div>

        {selectedGroupLabel && (
          <div>
            <p>Libellé du groupe sélectionné: {selectedGroupLabel}</p>
          </div>
        )}

        {selectedThemeLabel && (
          <div>
            <p>Libellé du thème sélectionné: {selectedThemeLabel}</p>
          </div>
        )}

        <div className="flex justify-end mt-11">
          <div>
            <Button
              style={{ borderRadius: "0px" }}
              className="white-button"
              onClick={handleCancel}
            >
              <span className="mr-2">
                <CloseOutlined />
              </span>
              Annuler
            </Button>
          </div>
          <div>
            <Button
              style={{ borderRadius: "0px", margin: "0 10px" }}
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

export default CampagneForm;
