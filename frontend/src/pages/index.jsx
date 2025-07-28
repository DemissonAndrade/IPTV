// Páginas básicas para completar a estrutura do painel admin

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const UsersPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
        <p className="text-muted-foreground">Gerenciar usuários do sistema</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>Página em desenvolvimento</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Funcionalidade em desenvolvimento...</p>
        </CardContent>
      </Card>
    </div>
  );
};

const ChannelsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Canais</h1>
        <p className="text-muted-foreground">Gerenciar canais de TV</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Canais</CardTitle>
          <CardDescription>Página em desenvolvimento</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Funcionalidade em desenvolvimento...</p>
        </CardContent>
      </Card>
    </div>
  );
};

const CategoriesPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
        <p className="text-muted-foreground">Gerenciar categorias de conteúdo</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Categorias</CardTitle>
          <CardDescription>Página em desenvolvimento</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Funcionalidade em desenvolvimento...</p>
        </CardContent>
      </Card>
    </div>
  );
};

const VODPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">VOD</h1>
        <p className="text-muted-foreground">Gerenciar filmes e séries</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Conteúdo VOD</CardTitle>
          <CardDescription>Página em desenvolvimento</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Funcionalidade em desenvolvimento...</p>
        </CardContent>
      </Card>
    </div>
  );
};

const PlansPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Planos</h1>
        <p className="text-muted-foreground">Gerenciar planos de assinatura</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Planos</CardTitle>
          <CardDescription>Página em desenvolvimento</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Funcionalidade em desenvolvimento...</p>
        </CardContent>
      </Card>
    </div>
  );
};

const EPGPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">EPG</h1>
        <p className="text-muted-foreground">Gerenciar guia de programação</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Guia de Programação</CardTitle>
          <CardDescription>Página em desenvolvimento</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Funcionalidade em desenvolvimento...</p>
        </CardContent>
      </Card>
    </div>
  );
};

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">Configurações do sistema</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Configurações Gerais</CardTitle>
          <CardDescription>Página em desenvolvimento</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Funcionalidade em desenvolvimento...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export {
  UsersPage,
  ChannelsPage,
  CategoriesPage,
  VODPage,
  PlansPage,
  EPGPage,
  SettingsPage,
};

