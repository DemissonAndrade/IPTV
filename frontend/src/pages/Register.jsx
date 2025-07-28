import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  InputAdornment,
  IconButton,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Person,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Payment,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { plansService } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    planoId: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const steps = ['Dados Pessoais', 'Escolher Plano', 'Confirmação'];

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const response = await plansService.getAll();
        setPlans(response.data || []);
      } catch (err) {
        console.error('Erro ao carregar planos:', err);
      } finally {
        setLoadingPlans(false);
      }
    };

    loadPlans();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (error) clearError();
  };

  const validateStep = (step) => {
    const errors = {};
    if (step === 0) {
      if (!formData.nome || formData.nome.length < 2)
        errors.nome = 'Nome deve ter pelo menos 2 caracteres';
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
        errors.email = 'Email inválido';
      if (!formData.senha || formData.senha.length < 6)
        errors.senha = 'Senha deve ter pelo menos 6 caracteres';
      if (!formData.confirmarSenha || formData.senha !== formData.confirmarSenha)
        errors.confirmarSenha = 'Senhas não coincidem';
    }

    if (step === 1 && !formData.planoId) {
      errors.planoId = 'Selecione um plano';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(0) || !validateStep(1)) return;

    console.log('Dados enviados no registro:', formData);

    const result = await register(formData);
    console.log('Resultado do registro:', result);

    if (result.success) {
      clearError();
      // Navegar para dashboard após registro bem-sucedido
      navigate('/dashboard', { replace: true });
    }
  };

  const renderStepContent = (step) => {
    const selectedPlan = plans.find(p => String(p.id) === String(formData.planoId));
    if (step === 0) {
      return (
        <Box>
          <TextField fullWidth name="nome" label="Nome Completo" value={formData.nome}
            onChange={handleChange} error={!!formErrors.nome} helperText={formErrors.nome}
            margin="normal" InputProps={{ startAdornment: <InputAdornment position="start"><Person /></InputAdornment> }} sx={{ mb: 2 }} />
          <TextField fullWidth name="email" label="Email" type="email" value={formData.email}
            onChange={handleChange} error={!!formErrors.email} helperText={formErrors.email}
            margin="normal" InputProps={{ startAdornment: <InputAdornment position="start"><Email /></InputAdornment> }} sx={{ mb: 2 }} />
          <TextField fullWidth name="senha" label="Senha" type={showPassword ? 'text' : 'password'}
            value={formData.senha} onChange={handleChange} error={!!formErrors.senha}
            helperText={formErrors.senha} margin="normal" InputProps={{
              startAdornment: <InputAdornment position="start"><Lock /></InputAdornment>,
              endAdornment: <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }} sx={{ mb: 2 }} />
          <TextField fullWidth name="confirmarSenha" label="Confirmar Senha" type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmarSenha} onChange={handleChange} error={!!formErrors.confirmarSenha}
            helperText={formErrors.confirmarSenha} margin="normal" InputProps={{
              startAdornment: <InputAdornment position="start"><Lock /></InputAdornment>,
              endAdornment: <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }} />
        </Box>
      );
    }

    if (step === 1) {
      return (
        <Box>
          <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>Escolha seu plano</Typography>
          {loadingPlans ? (
            <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress /></Box>
          ) : (
            <FormControl fullWidth error={!!formErrors.planoId}>
              <InputLabel>Plano</InputLabel>
              <Select name="planoId" value={formData.planoId} onChange={handleChange} label="Plano">
                {plans.map((plan) => (
                  <MenuItem key={plan.id} value={String(plan.id)}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {plan.nome} - R$ {parseFloat(plan.preco).toFixed(2)}/mês
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {plan.descricao} • {plan.qualidade_max} • {plan.dispositivos_simultaneos} dispositivo(s)
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {formErrors.planoId && <FormHelperText>{formErrors.planoId}</FormHelperText>}
            </FormControl>
          )}
        </Box>
      );
    }

    if (step === 2) {
      return (
        <Box>
          <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>Confirme seus dados</Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">Nome:</Typography>
            <Typography variant="body1">{formData.nome}</Typography>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">Email:</Typography>
            <Typography variant="body1">{formData.email}</Typography>
          </Box>
          {selectedPlan && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">Plano Selecionado:</Typography>
              <Typography variant="body1" fontWeight="bold">
                {selectedPlan.nome} - R$ {parseFloat(selectedPlan.preco).toFixed(2)}/mês
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedPlan.descricao}
              </Typography>
            </Box>
          )}
        </Box>
      );
    }

    return null;
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" color="primary.main" gutterBottom>
            Criar Conta
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Junte-se ao IPTV Pro
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button onClick={handleBack} disabled={activeStep === 0}>Voltar</Button>
            {activeStep === steps.length - 1 ? (
              <Button type="submit" variant="contained" disabled={isLoading}>
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Criar Conta'}
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext}>Próximo</Button>
            )}
          </Box>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Já tem uma conta?{' '}
            <Link component={RouterLink} to="/login" sx={{ fontWeight: 600, color: 'primary.main' }}>
              Faça login aqui
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
