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
    nombreDon: 0,
    banniere: "",
    dateCreation: "",
    dateModification: "",
    groupe: { id: "" },
    theme: { id: "" },
    active: false,
    supprime: false,
  });

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
          setSelectedThemeId(res.data.theme.id);
        })
        .catch((err) => {
          console.log("Error from Update");
        });
    }
  }, [id, form]);

  const handleSaveGroupe = async (values) => {
    const data = {
      ...campagne,
      ...values,
      groupe: { id: selectedGroupId },
      theme: { id: selectedThemeId },
      nombreDon: campagne?.nombreDon || 0,
    };

    const promise = campagne.id
      ? axios.put(`/campagnes/${campagne.id}`, data)
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
        style={{ marginTop: "50px" }}
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

          <Form.Item label="Date de début" name="dateDebut">
            <Input type="date" style={{ borderRadius: 0 }} />
          </Form.Item>

          <Form.Item label="Date de fin" name="dateFin">
            <Input type="date" style={{ borderRadius: 0 }} />
          </Form.Item>

          {/* <Form.Item label="Date de Création" name="dateCreation">
            <Input type="date" style={{ borderRadius: 0 }} />
          </Form.Item>

          <Form.Item label="Date de Modification" name="dateModification">
            <Input type="date"  style={{ borderRadius: 0 }} />
          </Form.Item> */}

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

        <div className="flex items-center ml-500 mt-20 ">
          <div className="w-full">
            <Button
              className="bg-orange-500 text-white rounded-0 w-full border-transparent"
              onClick={handleCancel}
            >
              <span className="mr-2">
                <CloseOutlined />
              </span>
              Annuler
            </Button>
          </div>
          <div className="w-full mx-10">
            <Button
              className="bg-black text-white rounded-0 w-full"
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
