---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Entendiendo el Apagón Global de CrowdStrike: ¿Qué Salió Mal?"
slug: "entendiendo-apagon-global-crowdstrike-que-salio-mal"
author: "Ignacio Amat"
description: "Un análisis del apagón global masivo de CrowdStrike, su impacto y lecciones aprendidas para profesionales de ciberseguridad."
image:
    url: "/img/optimized/crowdstrike-outage-compress.webp"
    alt: "Una pantalla azul de la muerte (BSOD) en un monitor de computadora."
publish_date: "06/08/2024"
tags: ["CrowdStrike", "ciberseguridad", "actualización de software", "apagón global", "gestión de TI"]
---
# Entendiendo el Apagón Global de CrowdStrike: ¿Qué Salió Mal?

El 19 de julio de 2024, el mundo de la ciberseguridad se vio sacudido por un apagón masivo causado por una actualización defectuosa de software de CrowdStrike. Este incidente interrumpió las operaciones de millones de usuarios y destacó las vulnerabilidades en la forma en que se manejan las actualizaciones automáticas por parte de las firmas de ciberseguridad.

## ¿Qué Sucedió?

El problema comenzó con una actualización de contenido de CrowdStrike para su software de seguridad de endpoints Falcon. Esta actualización, destinada a mejorar la lógica de protección y detectar nuevas amenazas, provocó problemas significativos. La actualización causó una "pantalla azul de la muerte" (BSOD) en sistemas Windows, afectando a alrededor de 8.5 millones de dispositivos a nivel mundial. Notablemente, los sistemas Linux y macOS no se vieron afectados.

## El Impacto

La naturaleza generalizada del apagón paralizó numerosos sistemas críticos, afectando a empresas, organizaciones gubernamentales e instituciones financieras. Desde vuelos cancelados en Europa hasta servicios de emergencia inoperativos, los efectos fueron extensos. Este incidente subraya la interconexión de los sistemas informáticos modernos y los riesgos potenciales inherentes a las actualizaciones automáticas.

## Respuesta y Remediación

CrowdStrike identificó rápidamente la actualización problemática y revirtió los cambios. Sin embargo, el proceso de recuperación para los sistemas afectados fue manual y laborioso, requiriendo intervención física para eliminar la actualización y reiniciar los sistemas. Esto ha retrasado la resolución completa del apagón.

En respuesta, CrowdStrike ha emitido una guía de remediación y continúa trabajando con las organizaciones afectadas para restaurar las operaciones normales. Además, el incidente ha generado discusiones sobre la mejora de las pruebas y la implementación de actualizaciones para prevenir ocurrencias similares en el futuro.

## Lecciones Aprendidas

El apagón de CrowdStrike destaca varios puntos clave para los administradores de TI y los profesionales de la ciberseguridad:

1. **Importancia de las Pruebas de Actualización**: Probar exhaustivamente las actualizaciones en diversos entornos antes de la implementación completa puede mitigar el riesgo de problemas generalizados.
2. **Planes de Recuperación Manual**: Tener procedimientos de recuperación manual en su lugar puede ayudar a gestionar y agilizar el proceso de recuperación cuando los sistemas automatizados fallan.
3. **Comunicación y Apoyo**: Una comunicación clara y rápida por parte de las firmas de ciberseguridad es crucial para gestionar las consecuencias de tales incidentes y ayudar a los usuarios afectados.

A medida que las amenazas de ciberseguridad continúan evolucionando, también deben hacerlo las estrategias para protegerse contra ellas. Si bien ningún sistema puede ser completamente inmune a los problemas, las pruebas robustas y la preparación pueden reducir significativamente el impacto de problemas imprevistos.

<style>
    article p + h2 {
    font-size: 1.5em;
    font-weight: bold;
    margin-top: 1.5em;
  }

  article h2 + h1 {
    font-size: 2em;
    font-weight: bold;
    margin-top: 1.5em;
  }

    article {
        text-wrap: pretty;
    }
    
    article h3 {
    font-weight: bold;
      font-size: 1.5em;
      margin-top: 1.5em;
    }

article p {
    margin: 10px 0;
}

article ul, article ol {
    list-style-type: circle;
    margin: 10px 0 10px 20px;
}

article li h4 {
    /* add soft light font */
    font-weight: lighter;
    font-style: italic;
}

article blockquote {
    border-left: 4px solid #ddd;
    padding-left: 15px;
    color: #666;
    margin: 20px 0;
    font-style: italic;
}

article p a {
      cursor: pointer;
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem; /* py-2 px-4 */
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  color: #1f2937; /* text-gray-900 */
  background-color: #ffffff; /* bg-white */
  border: 1px solid #e5e7eb; /* border border-gray-200 */
  border-radius: 0.5rem; /* rounded-lg */
  transition: all 0.2s ease-in-out; /* transition */
}

article p a:hover {
    background-color: #f3f4f6; /* hover:bg-gray-100 */
  color: rgba(234, 179, 8, 0.9); /* hover:text-yellow-500/90 */
}

article p a:focus {
    z-index: 10; /* focus:z-10 */
  outline: none; /* focus:outline-none */
  border-color: #e5e7eb; /* focus:ring-gray-200 */
  box-shadow: 0 0 0 2px #e5e7eb; /* focus:ring-2 */
  color: rgba(234, 179, 8, 0.9); /* focus:text-yellow-500/90 */
}

article code {
    background-color: #f5f5f5;
    padding: 2px 4px;
    border-radius: 4px;
    font-family: 'Courier New', Courier, monospace;
}

article pre {
    background-color: #f5f5f5;
    padding: 10px;
    border-radius: 4px;
    overflow-x: auto;
}

@media (min-width: 601px) and (max-width: 1024px) {
    article {
        padding: 40px;
    }
}

@media (max-width: 600px) { 
    article {
      padding: 30px;
    }

 }
</style>