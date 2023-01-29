
var storageAccountName = 'stremotea'
param rgLocation string = resourceGroup().location


resource storageAccountName_resource 'Microsoft.Storage/storageAccounts@2021-01-01' = {
  name: storageAccountName
  location: rgLocation
  sku: {
    name: 'Standard_RAGRS'  
  }
  kind: 'StorageV2'
  properties: {
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: true
    allowSharedKeyAccess: true
    networkAcls: {
      bypass: 'AzureServices'
      virtualNetworkRules: []
      ipRules: []
      defaultAction: 'Allow'
    }
    supportsHttpsTrafficOnly: true
    encryption: {
      services: {
        file: {
          keyType: 'Account'
          enabled: true
        }
        blob: {
          keyType: 'Account'
          enabled: true
        }
      }
      keySource: 'Microsoft.Storage'
    }
    accessTier: 'Hot'
  }
}

resource storageAccountName_default 'Microsoft.Storage/storageAccounts/blobServices@2021-01-01' = {
  parent: storageAccountName_resource
  name: 'default' 
  properties: {
    cors: {
      corsRules: []
    }
    deleteRetentionPolicy: {
      enabled: false
    }
  }
}

resource storageAccountName_default_web 'Microsoft.Storage/storageAccounts/blobServices/containers@2021-01-01' = {
  parent: storageAccountName_default
  name: '$web'
  properties: {
    defaultEncryptionScope: '$account-encryption-key'
    denyEncryptionScopeOverride: false
    publicAccess: 'None'
  }  
}
