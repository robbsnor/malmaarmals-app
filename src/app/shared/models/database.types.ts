export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
    graphql_public: {
        Tables: {
            [_ in never]: never;
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            graphql: {
                Args: {
                    extensions?: Json;
                    operationName?: string;
                    query?: string;
                    variables?: Json;
                };
                Returns: Json;
            };
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
    public: {
        Tables: {
            categories: {
                Row: {
                    category_id: string;
                    id: string;
                    image_url: string | null;
                    title: string;
                };
                Insert: {
                    category_id: string;
                    id?: string;
                    image_url?: string | null;
                    title: string;
                };
                Update: {
                    category_id?: string;
                    id?: string;
                    image_url?: string | null;
                    title?: string;
                };
                Relationships: [];
            };
            chapters: {
                Row: {
                    category_id: string;
                    end_s: number;
                    id: string;
                    start_s: number;
                    video_id: number;
                };
                Insert: {
                    category_id: string;
                    end_s: number;
                    id?: string;
                    start_s: number;
                    video_id: number;
                };
                Update: {
                    category_id?: string;
                    end_s?: number;
                    id?: string;
                    start_s?: number;
                    video_id?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: 'chapters_category_id_fkey';
                        columns: ['category_id'];
                        isOneToOne: false;
                        referencedRelation: 'categories';
                        referencedColumns: ['category_id'];
                    },
                    {
                        foreignKeyName: 'chapters_video_id_fkey';
                        columns: ['video_id'];
                        isOneToOne: false;
                        referencedRelation: 'videos';
                        referencedColumns: ['video_id'];
                    },
                ];
            };
            history: {
                Row: {
                    id: string;
                    user_id: string;
                    video_id: string;
                    watched_at: string | null;
                };
                Insert: {
                    id?: string;
                    user_id?: string;
                    video_id: string;
                    watched_at?: string | null;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    video_id?: string;
                    watched_at?: string | null;
                };
                Relationships: [];
            };
            messages: {
                Row: {
                    date: string;
                    id: string;
                    message_id: string;
                    offset_sec: number;
                    text: string;
                    user_color: string | null;
                    user_id: number;
                    user_login: string;
                    user_name: string;
                    video_id: number | null;
                };
                Insert: {
                    date: string;
                    id?: string;
                    message_id: string;
                    offset_sec: number;
                    text: string;
                    user_color?: string | null;
                    user_id: number;
                    user_login: string;
                    user_name: string;
                    video_id?: number | null;
                };
                Update: {
                    date?: string;
                    id?: string;
                    message_id?: string;
                    offset_sec?: number;
                    text?: string;
                    user_color?: string | null;
                    user_id?: number;
                    user_login?: string;
                    user_name?: string;
                    video_id?: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'messages_video_id_fkey';
                        columns: ['video_id'];
                        isOneToOne: false;
                        referencedRelation: 'videos';
                        referencedColumns: ['video_id'];
                    },
                ];
            };
            playlist_videos: {
                Row: {
                    id: string;
                    playlist_id: string;
                    video_id: string;
                };
                Insert: {
                    id?: string;
                    playlist_id: string;
                    video_id: string;
                };
                Update: {
                    id?: string;
                    playlist_id?: string;
                    video_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'playlist_videos_playlist_id_fkey';
                        columns: ['playlist_id'];
                        isOneToOne: false;
                        referencedRelation: 'playlists';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'playlist_videos_video_id_fkey';
                        columns: ['video_id'];
                        isOneToOne: false;
                        referencedRelation: 'videos';
                        referencedColumns: ['id'];
                    },
                ];
            };
            playlists: {
                Row: {
                    created_at: string;
                    description: string | null;
                    id: string;
                    position: number | null;
                    title: string;
                };
                Insert: {
                    created_at?: string;
                    description?: string | null;
                    id?: string;
                    position?: number | null;
                    title: string;
                };
                Update: {
                    created_at?: string;
                    description?: string | null;
                    id?: string;
                    position?: number | null;
                    title?: string;
                };
                Relationships: [];
            };
            videos: {
                Row: {
                    description: string | null;
                    id: string;
                    length_sec: number;
                    recorded_at: string;
                    title: string;
                    video_id: number;
                };
                Insert: {
                    description?: string | null;
                    id?: string;
                    length_sec: number;
                    recorded_at: string;
                    title: string;
                    video_id: number;
                };
                Update: {
                    description?: string | null;
                    id?: string;
                    length_sec?: number;
                    recorded_at?: string;
                    title?: string;
                    video_id?: number;
                };
                Relationships: [];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
    DefaultSchemaTableNameOrOptions extends
        | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
        | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals;
    }
        ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
              DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
        : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
}
    ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
          DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
          Row: infer R;
      }
        ? R
        : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
      ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
            Row: infer R;
        }
          ? R
          : never
      : never;

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals;
    }
        ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
        : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
          Insert: infer I;
      }
        ? I
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
      ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
            Insert: infer I;
        }
          ? I
          : never
      : never;

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals;
    }
        ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
        : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
          Update: infer U;
      }
        ? U
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
      ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
            Update: infer U;
        }
          ? U
          : never
      : never;

export type Enums<
    DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals;
    }
        ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
        : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
}
    ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
      ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
      : never;

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
        | keyof DefaultSchema['CompositeTypes']
        | { schema: keyof DatabaseWithoutInternals },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals;
    }
        ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
        : never = never,
> = PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
}
    ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
      ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
      : never;

export const Constants = {
    graphql_public: {
        Enums: {},
    },
    public: {
        Enums: {},
    },
} as const;
