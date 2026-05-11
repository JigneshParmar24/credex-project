export const TOOLS_DATA = {
  cursor: {
    name: "Cursor",
    category: "coding",
    plans: {
      hobby: {
        price: 0,
        maxSeats: 1,
        minSeats: 1,
        level: 1,
        bestFor: ["coding"]
      },
      pro: {
        price: 20,
        maxSeats: 1,
        minSeats: 1,
        level: 2,
        bestFor: ["coding"]
      },
      business: {
        price: 40,
        maxSeats: null,
        minSeats: 2,
        level: 3,
        bestFor: ["coding"]
      },
      enterprise: {
        price: null,
        maxSeats: null,
        minSeats: 10,
        level: 4,
        bestFor: ["coding"]
      }
    },
    alternatives: {
      coding: ["github_copilot", "windsurf"],
      writing: ["claude", "chatgpt"],
      research: ["claude", "chatgpt", "gemini"],
      data: ["chatgpt", "claude"],
      mixed: ["claude", "github_copilot"]
    }
  },

  github_copilot: {
    name: "GitHub Copilot",
    category: "coding",
    plans: {
      individual: {
        price: 10,
        maxSeats: 1,
        minSeats: 1,
        level: 2,
        bestFor: ["coding"]
      },
      business: {
        price: 19,
        maxSeats: null,
        minSeats: 2,
        level: 3,
        bestFor: ["coding"]
      },
      enterprise: {
        price: 39,
        maxSeats: null,
        minSeats: 5,
        level: 4,
        bestFor: ["coding"]
      }
    },
    alternatives: {
      coding: ["cursor", "windsurf"],
      writing: ["claude", "chatgpt"],
      research: ["claude", "chatgpt"],
      data: ["chatgpt", "claude"],
      mixed: ["cursor", "claude"]
    }
  },

  claude: {
    name: "Claude",
    category: "mixed",
    plans: {
      free: {
        price: 0,
        maxSeats: 1,
        minSeats: 1,
        level: 1,
        bestFor: ["writing", "research", "mixed"]
      },
      pro: {
        price: 20,
        maxSeats: 1,
        minSeats: 1,
        level: 2,
        bestFor: ["writing", "research", "mixed", "coding"]
      },
      max: {
        price: 100,
        maxSeats: 1,
        minSeats: 1,
        level: 3,
        bestFor: ["writing", "research", "mixed", "coding", "data"]
      },
      team: {
        price: 20,
        maxSeats: 150,
        minSeats: 5,
        level: 2,
        bestFor: ["writing", "research", "mixed", "coding"]
      },
      enterprise: {
        price: null,
        maxSeats: null,
        minSeats: 10,
        level: 4,
        bestFor: ["writing", "research", "mixed", "coding", "data"]
      }
    },
    alternatives: {
      coding: ["cursor", "github_copilot", "windsurf"],
      writing: ["chatgpt"],
      research: ["chatgpt", "gemini"],
      data: ["chatgpt", "gemini"],
      mixed: ["chatgpt", "gemini"]
    }
  },

  chatgpt: {
    name: "ChatGPT",
    category: "mixed",
    plans: {
      free: {
        price: 0,
        maxSeats: 1,
        minSeats: 1,
        level: 1,
        bestFor: ["writing", "research", "mixed"]
      },
      go: {
        price: 8,
        maxSeats: 1,
        minSeats: 1,
        level: 1.5,
        bestFor: ["writing", "research", "mixed"]
      },
      plus: {
        price: 20,
        maxSeats: 1,
        minSeats: 1,
        level: 2,
        bestFor: ["writing", "research", "mixed", "coding", "data"]
      },
      team: {
        price: 30,
        maxSeats: null,
        minSeats: 2,
        level: 3,
        bestFor: ["writing", "research", "mixed", "coding", "data"]
      },
      enterprise: {
        price: null,
        maxSeats: null,
        minSeats: 10,
        level: 4,
        bestFor: ["writing", "research", "mixed", "coding", "data"]
      }
    },
    alternatives: {
      coding: ["cursor", "github_copilot", "windsurf"],
      writing: ["claude"],
      research: ["claude", "gemini"],
      data: ["claude", "gemini"],
      mixed: ["claude", "gemini"]
    }
  },

  gemini: {
    name: "Gemini",
    category: "mixed",
    plans: {
      free: {
        price: 0,
        maxSeats: 1,
        minSeats: 1,
        level: 1,
        bestFor: ["writing", "research", "mixed"]
      },
      advanced: {
        price: 19.99,
        maxSeats: 1,
        minSeats: 1,
        level: 2,
        bestFor: ["writing", "research", "mixed", "data"]
      },
      business: {
        price: 24,
        maxSeats: null,
        minSeats: 2,
        level: 3,
        bestFor: ["writing", "research", "mixed", "data"]
      },
      enterprise: {
        price: 36,
        maxSeats: null,
        minSeats: 5,
        level: 4,
        bestFor: ["writing", "research", "mixed", "data"]
      }
    },
    alternatives: {
      coding: ["cursor", "github_copilot", "windsurf"],
      writing: ["claude", "chatgpt"],
      research: ["claude", "chatgpt"],
      data: ["chatgpt", "claude"],
      mixed: ["claude", "chatgpt"]
    }
  },

  windsurf: {
    name: "Windsurf",
    category: "coding",
    plans: {
      free: {
        price: 0,
        maxSeats: 1,
        minSeats: 1,
        level: 1,
        bestFor: ["coding"]
      },
      pro: {
        price: 20,
        maxSeats: 1,
        minSeats: 1,
        level: 2,
        bestFor: ["coding"]
      },
      teams: {
        price: 40,
        maxSeats: null,
        minSeats: 2,
        level: 3,
        bestFor: ["coding"]
      },
      enterprise: {
        price: null,
        maxSeats: null,
        minSeats: 10,
        level: 4,
        bestFor: ["coding"]
      }
    },
    alternatives: {
      coding: ["cursor", "github_copilot"],
      writing: ["claude", "chatgpt"],
      research: ["claude", "chatgpt"],
      data: ["chatgpt", "claude"],
      mixed: ["cursor", "claude"]
    }
  },

  v0: {
    name: "v0",
    category: "coding",
    plans: {
      free: {
        price: 0,
        maxSeats: 1,
        minSeats: 1,
        level: 1,
        bestFor: ["coding"]
      },
      teams: {
        price: 30,
        maxSeats: null,
        minSeats: 2,
        level: 2,
        bestFor: ["coding"]
      }
    },
    alternatives: {
      coding: ["cursor", "windsurf", "lovable"],
      writing: ["claude", "chatgpt"],
      research: ["claude", "chatgpt"],
      data: ["chatgpt", "claude"],
      mixed: ["cursor", "claude"]
    }
  },

  lovable: {
    name: "Lovable",
    category: "coding",
    plans: {
      free: {
        price: 0,
        maxSeats: 1,
        minSeats: 1,
        level: 1,
        bestFor: ["coding"]
      },
      pro: {
        price: 25,
        maxSeats: 1,
        minSeats: 1,
        level: 2,
        bestFor: ["coding"]
      },
      business: {
        price: 50,
        maxSeats: null,
        minSeats: 2,
        level: 3,
        bestFor: ["coding"]
      },
      enterprise: {
        price: null,
        maxSeats: null,
        minSeats: 10,
        level: 4,
        bestFor: ["coding"]
      }
    },
    alternatives: {
      coding: ["cursor", "windsurf", "v0"],
      writing: ["claude", "chatgpt"],
      research: ["claude", "chatgpt"],
      data: ["chatgpt", "claude"],
      mixed: ["cursor", "claude"]
    }
  },

  anthropic_api: {
    name: "Anthropic API",
    category: "api",
    plans: {
      payg: {
        price: null,
        maxSeats: null,
        minSeats: 1,
        level: 3,
        bestFor: ["coding", "writing", "research", "data", "mixed"]
      }
    },
    alternatives: {
      coding: ["cursor", "github_copilot"],
      writing: ["claude"],
      research: ["claude", "chatgpt"],
      data: ["openai_api", "gemini"],
      mixed: ["claude", "chatgpt"]
    }
  },

  openai_api: {
    name: "OpenAI API",
    category: "api",
    plans: {
      payg: {
        price: null,
        maxSeats: null,
        minSeats: 1,
        level: 3,
        bestFor: ["coding", "writing", "research", "data", "mixed"]
      }
    },
    alternatives: {
      coding: ["cursor", "github_copilot"],
      writing: ["chatgpt", "claude"],
      research: ["claude", "chatgpt"],
      data: ["anthropic_api", "gemini"],
      mixed: ["chatgpt", "claude"]
    }
  }
}