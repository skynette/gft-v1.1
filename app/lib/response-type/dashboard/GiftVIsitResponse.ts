
type GiftVisitRequest = {
    gift_id: string;
    metadata: {
      sourceCountry: string;
      sourceIP: string;
      sourceBrowser: string;
      sourceDeviceType: string;
      sourceOS: string;
      screenResolution: string;
      language: string;
      referrer: string;
      timestamp: string;
    };
  }