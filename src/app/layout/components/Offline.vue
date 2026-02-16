<script setup lang="ts">
import { Z } from '../../shared/directives/z.directive';

const props = withDefaults(
    defineProps<{
        loading: boolean;
        hasError: boolean;
    }>(),
    {}
);
</script>

<template>
    <div v-visible="props.loading || props.hasError" class="fixed inset-0 bg-black" v-z="Z.OFFLINE">
        <Container class="h-full">
            <div v-if="props.loading" class="h-full w-full flex flex-col gap-10 items-center justify-center">
                <Logo payoff />
                <v-progress-circular indeterminate size="64" color="primary" />
            </div>

            <div v-if="props.hasError" class="flex flex-col items-center gap-8 pt-20">
                <div class="flex justify-center">
                    <div class="w-60">
                        <Logo payoff />
                    </div>
                </div>

                <div class="w-20 h-[1px] bg-black-500 mx-auto"></div>

                <div class="text-center">
                    <div class="text-4xl font-bold pb-2">Oops,</div>
                    <div class="text-muted">
                        <p>
                            Since this App is partially self hosted, <br />
                            it is probably down for maintenance or went up in flames.
                        </p>
                        <p>We'll be back soon.</p>
                        <img
                            class="inline w-6"
                            src="https://static-cdn.jtvnw.net/emoticons/v2/717918/default/dark/2.0"
                            alt=""
                        />
                    </div>
                </div>
            </div>
        </Container>
    </div>
</template>
