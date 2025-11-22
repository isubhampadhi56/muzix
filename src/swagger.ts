import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Muzix API',
    version: '1.0.0',
    description: 'A YouTube music player API for managing playlists and videos',
    contact: {
      name: 'API Support',
      email: 'support@muzix.com'
    },
  },
  servers: [
    {
      url: 'http://localhost:4000',
      description: 'Development server',
    },
  ],
  components: {
    schemas: {
      Video: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Video ID',
          },
          url: {
            type: 'string',
            description: 'YouTube video URL',
          },
          name: {
            type: 'string',
            description: 'Video name',
          },
          audio: {
            type: 'string',
            description: 'Audio stream URL',
          },
          video: {
            type: 'string',
            description: 'Video stream URL',
          },
          playlist: {
            $ref: '#/components/schemas/Playlist',
          },
        },
      },
      Playlist: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Playlist ID',
          },
          name: {
            type: 'string',
            description: 'Playlist name',
          },
          location: {
            type: 'string',
            description: 'Playlist location',
          },
          videos: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Video',
            },
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            description: 'Error message',
          },
        },
      },
    },
    parameters: {
      PlaylistId: {
        name: 'id',
        in: 'path',
        required: true,
        schema: {
          type: 'string',
        },
        description: 'Playlist ID',
      },
      VideoId: {
        name: 'id',
        in: 'path',
        required: true,
        schema: {
          type: 'string',
        },
        description: 'Video ID',
      },
    },
  },
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./src/route/*.ts', './src/module/*.ts'],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

export { swaggerSpec, swaggerUi };
