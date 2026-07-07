<script setup lang="ts">
import { useVideosStore } from '../../videos/stores/videos.store';
import { useArchiveStore } from '../stores/archive.store';
import { DateHelper } from '../../shared/helpers/date.helper';

const videosStore = useVideosStore();
const archiveStore = useArchiveStore();

const dialog = defineModel<boolean>();
</script>

<template>
    <Dialog
        v-model="dialog"
        title="Date filters"
        icon="mdi-calendar-month-outline"
        description="Options are applied to your current search term."
    >
        <div class="flex gap-4 items-start">
            <FormGroup title="Years" class="w-full">
                <div class="grid grid-cols-2 gap-2">
                    <BigCheckbox
                        v-for="year in videosStore.years"
                        :key="year"
                        :label="year.toString()"
                        v-model="archiveStore.form.years"
                        :value="year"
                    />
                </div>
            </FormGroup>

            <div class="items self-stretch w-[2px] bg-black-500"></div>

            <FormGroup title="Months" class="w-full">
                <div class="grid grid-cols-3 gap-2">
                    <BigCheckbox
                        v-for="(month, i) in DateHelper.monthNames"
                        :key="month"
                        v-model="archiveStore.form.months"
                        :label="month.toUpperCase()"
                        :value="i"
                    />
                </div>
            </FormGroup>
        </div>

        <template #footer>
            <v-btn
                class="mr-auto"
                variant="text"
                :disabled="!archiveStore.formHasDateChanges"
                @click="archiveStore.formResetDates()"
            >
                reset
            </v-btn>
        </template>
    </Dialog>
</template>
