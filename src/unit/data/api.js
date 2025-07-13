import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

const getApiBaseUrl = () => getConfig().STUDIO_BASE_URL;

export const getVerticleBlockApiUrl = (unitId) => `${getApiBaseUrl()}/xblock/verticle/container/${unitId}`;
export const updateVerticleBlockApirUrl = (unitId) => `${getApiBaseUrl()}/xblock/${unitId}`;
export const createComponentBlockApirUrl = (componentBlockId) => `${getApiBaseUrl()}/xblock/`;
export const deleteComponentBlockApirUrl = (componentBlockId) => `${getApiBaseUrl()}/xblock/${componentBlockId}`;

export async function getVerticalBlock(unitId) {
  const { data } = await getAuthenticatedHttpClient()
    .get(
      getVerticleBlockApiUrl(unitId),
    );

  return camelCaseObject(data);
}

export async function updateVerticleBlock(unitId, payload) {
  const { data } = await getAuthenticatedHttpClient()
    .post(
      updateVerticleBlockApirUrl(unitId),
      payload
    );

  return camelCaseObject(data);
}

export async function createComponentBlock(payload) {
  const { data } = await getAuthenticatedHttpClient()
    .post(
      createComponentBlockApirUrl(),
      payload
    );

  return camelCaseObject(data);
}

export async function deleteComponentBlock(componentBlockId) {
  const { data } = await getAuthenticatedHttpClient()
    .delete(
      deleteComponentBlockApirUrl(componentBlockId)
    );

  return camelCaseObject(data);
}