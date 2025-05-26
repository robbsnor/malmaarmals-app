<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const refreshToken = 'sdfasfdsafsdaf'

const { data } = await supabase.auth.getSession()

onMounted(async () => {
    const response = await fetch(
        'https://your-supabase-project-url/functions/v1/refresh-twitch-token',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({ refreshToken }),
        },
    )

    if (!response.ok) {
        const errorData = await response.json()
        console.error('Error refreshing token:', errorData.error)
        return
    }

    const data = await response.json()
    console.log('New tokens:', data)
})
</script>

<template>
    <Container>
        <code>
            <pre>
				{{ data.session }}
			</pre
            >
        </code>
    </Container>
</template>
